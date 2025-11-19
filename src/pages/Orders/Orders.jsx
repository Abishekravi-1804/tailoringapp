import { useState, useEffect } from 'react'
import api from '../../services/api'
import { formatDate } from '../../utils/helpers'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { translations } from '../../utils/translations'

// Import professional icons
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSpinner, FaExclamationCircle, FaLock, FaCheckCircle, FaUser, FaEnvelope } from 'react-icons/fa'

// Helper component for the form modal
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all max-h-[90vh] overflow-y-auto">
      <div className="relative p-6 sm:p-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
          <FaTimes size={24} />
        </button>
        {children}
      </div>
    </div>
  </div>
);

const Orders = () => {
  const { language } = useLanguage()
  const { isAdmin, user } = useAuth()
  const t = translations[language]
  
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching orders...'); // Debug
      const response = await api.get('/orders')
      console.log('Orders fetched:', response.data); // Debug
      setOrders(response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
    } catch (err) {
      console.error('Fetch orders error:', err); // Debug
      setError(language === 'ta' ? 'ஆர்டர்களைப் பெற முடியவில்லை. பின்னணி இயங்குகிறதா என்பதைச் சரிபார்க்கவும்.' : 'Failed to fetch orders. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleCreate = () => {
    setEditingOrder(null)
    setShowForm(true)
  }

  const handleEdit = (order) => {
    console.log('Editing order:', order); // Debug
    setEditingOrder(order)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!isAdmin()) {
      alert(language === 'ta' ? 'நீங்கள் இதை நீக்க அனுமதி இல்லை' : 'You do not have permission to delete orders')
      return
    }

    const confirmMessage = language === 'ta' 
      ? 'இந்த ஆர்டரை நீக்க விரும்புகிறீர்களா?'
      : 'Are you sure you want to delete this order?'
    if (!window.confirm(confirmMessage)) return
    
    try {
      console.log('Deleting order:', id); // Debug
      await api.delete(`/orders/${id}`)
      await fetchOrders()
    } catch (err) {
      console.error('Delete error:', err); // Debug
      setError(err.response?.data?.detail || (language === 'ta' ? 'ஆர்டரை நீக்க முடியவில்லை' : 'Failed to delete order'))
    }
  }

  const handleFormSubmit = async () => {
    await fetchOrders()
    setShowForm(false)
    setEditingOrder(null)
  }

  // Debug: Log admin status
  console.log('Is Admin?', isAdmin());

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            {t.ordersTitle}
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            {isAdmin() ? (
              <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                <FaLock className="text-xs" />
                {language === 'ta' ? 'நிர்வாகி பார்வை - முழு அணுகல்' : 'Admin View - Full Access'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                {language === 'ta' ? 'பயனர் பார்வை - வரையறுக்கப்பட்ட அணுகல்' : 'User View - Limited Access'}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-5 py-3 rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all font-semibold shadow-md hover:shadow-lg"
        >
          <FaPlus /> {t.newOrder}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-3">
          <FaExclamationCircle /> {error}
        </div>
      )}

      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <OrderForm 
            editingOrder={editingOrder} 
            onSuccess={handleFormSubmit}
            onCancel={() => setShowForm(false)}
            t={t}
            language={language}
            isAdmin={isAdmin()}
            currentUser={user}
          />
        </Modal>
      )}

      {loading ? (
        <div className="text-center py-12 flex flex-col items-center">
          <FaSpinner className="animate-spin text-primary-500 h-12 w-12" />
          <p className="mt-4 text-gray-600">{t.loadingOrders}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-lg text-center border border-gray-100">
          <p className="text-gray-600 text-lg mb-4">{t.noOrders}</p>
          <p className="text-gray-500">{t.createFirstOrder}</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              t={t} 
              language={language} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              isAdmin={isAdmin()}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Order Form Sub-component
const OrderForm = ({ editingOrder, onSuccess, onCancel, t, language, isAdmin, currentUser }) => {
  const [formData, setFormData] = useState({
    customer_name: '', 
    item_type: '', 
    item_description: '', 
    measurements: {}, 
    due_date: '', 
    status: 'pending'
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingOrder) {
      const measurements = editingOrder.measurements || {};
      setFormData({
        customer_name: editingOrder.customer_name || '',
        item_type: editingOrder.item_type || '',
        item_description: editingOrder.item_description || '',
        measurements: {
          bust: measurements.bust || '', 
          waist: measurements.waist || '', 
          hip: measurements.hip || '', 
          shoulder: measurements.shoulder || '', 
          length: measurements.length || ''
        },
        due_date: editingOrder.due_date ? editingOrder.due_date.split('T')[0] : '',
        status: editingOrder.status || 'pending'
      });
      console.log('Form initialized with:', editingOrder); // Debug
    }
  }, [editingOrder]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Input changed:', name, value); // Debug
    
    if (name.startsWith('measurement_')) {
      const key = name.replace('measurement_', '');
      setFormData(p => ({ 
        ...p, 
        measurements: { ...p.measurements, [key]: value } 
      }));
    } else {
      setFormData(p => ({ ...p, [name]: value }));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submitted. isAdmin:', isAdmin); // Debug
    console.log('Current formData:', formData); // Debug
    console.log('Editing order:', editingOrder); // Debug
    
    // Permission check for non-admins
    if (editingOrder && !isAdmin && formData.status !== editingOrder.status) {
      const errorMsg = language === 'ta' 
        ? 'நீங்கள் ஆர்டர் நிலையை மாற்ற அனுமதி இல்லை' 
        : 'You do not have permission to change order status';
      setError(errorMsg);
      console.log('Permission denied:', errorMsg); // Debug
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Clean up measurements - remove empty values
      const cleanedMeasurements = {};
      Object.entries(formData.measurements).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          cleanedMeasurements[key] = value;
        }
      });

      const dataToSend = {
        customer_name: formData.customer_name,
        item_type: formData.item_type,
        item_description: formData.item_description,
        measurements: cleanedMeasurements,
        due_date: formData.due_date,
        status: formData.status
      };

      console.log('Sending data to API:', dataToSend); // Debug

      if (editingOrder) {
        const response = await api.put(`/orders/${editingOrder.id}`, dataToSend);
        console.log('Update response:', response.data); // Debug
      } else {
        const response = await api.post('/orders', dataToSend);
        console.log('Create response:', response.data); // Debug
      }
      
      onSuccess();
    } catch (err) {
      console.error('Form submit error:', err); // Debug
      console.error('Error response:', err.response); // Debug
      const errorMsg = err.response?.data?.detail || 
                      (language === 'ta' ? 'ஆர்டரைச் சேமிக்க முடியவில்லை' : 'Failed to save order');
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
        {editingOrder ? t.editOrder : t.createOrder}
      </h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <FaExclamationCircle className="text-red-500 mr-2" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}
      
      {/* Show who is creating/editing the order */}
      {currentUser && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <FaUser className="text-blue-500" />
            <span className="font-medium">
              {language === 'ta' ? 'ஆர்டர் உருவாக்குபவர்:' : 'Order created by:'}
            </span>
            <span className="font-semibold">{currentUser.name}</span>
            <span className="text-blue-500">({currentUser.email})</span>
          </div>
        </div>
      )}
      
      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.customerName} <span className="text-red-500">*</span>
          </label>
          <input 
            name="customer_name" 
            value={formData.customer_name} 
            onChange={handleInputChange} 
            placeholder={t.customerName} 
            required 
            className="form-input w-full" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ta' ? 'பொருள் வகை' : 'Item Type'} <span className="text-red-500">*</span>
          </label>
          <select 
            name="item_type" 
            value={formData.item_type} 
            onChange={handleInputChange} 
            required
            className="form-input w-full"
          >
            <option value="">{language === 'ta' ? 'பொருள் வகையைத் தேர்ந்தெடுக்கவும்' : 'Select Item Type'}</option>
            <option value="Blouse">Blouse</option>
            <option value="Saree">Saree</option>
            <option value="Chudithar">Chudithar</option>
            <option value="Frock">Frock</option>
            <option value="Langavoni">Langavoni</option>
            <option value="Alterations">Alterations</option>
          </select>
        </div>
      </div>
      
      {/* Item Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ta' ? 'கூடுதல் விவரங்கள்' : 'Additional Details'}
        </label>
        <input 
          name="item_description" 
          value={formData.item_description} 
          onChange={handleInputChange} 
          placeholder={language === 'ta' ? 'கூடுதல் விவரங்கள்' : 'e.g., color, fabric, special requirements'} 
          className="form-input w-full" 
        />
      </div>
      
      {/* Measurements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t.measurements}</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <input 
            name="measurement_bust" 
            value={formData.measurements.bust || ''} 
            onChange={handleInputChange} 
            placeholder={t.bust || 'Bust'} 
            className="form-input" 
          />
          <input 
            name="measurement_waist" 
            value={formData.measurements.waist || ''} 
            onChange={handleInputChange} 
            placeholder={t.waist || 'Waist'} 
            className="form-input" 
          />
          <input 
            name="measurement_hip" 
            value={formData.measurements.hip || ''} 
            onChange={handleInputChange} 
            placeholder={t.hip || 'Hip'} 
            className="form-input" 
          />
          <input 
            name="measurement_shoulder" 
            value={formData.measurements.shoulder || ''} 
            onChange={handleInputChange} 
            placeholder={t.shoulder || 'Shoulder'} 
            className="form-input" 
          />
          <input 
            name="measurement_length" 
            value={formData.measurements.length || ''} 
            onChange={handleInputChange} 
            placeholder={t.length || 'Length'} 
            className="form-input" 
          />
        </div>
      </div>

      {/* Due Date and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.due || 'Due Date'}
          </label>
          <input 
            type="date" 
            name="due_date" 
            value={formData.due_date} 
            onChange={handleInputChange} 
            className="form-input w-full" 
          />
        </div>
        
        {/* Status dropdown - KEY FIELD FOR RBAC */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.status || 'Status'} {!isAdmin && <FaLock className="inline text-xs text-gray-400" />}
          </label>
          <div className="relative">
            <select 
              name="status" 
              value={formData.status} 
              onChange={handleInputChange} 
              disabled={!isAdmin}
              className={`form-input w-full ${!isAdmin ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}`}
              title={!isAdmin ? (language === 'ta' ? 'நிர்வாகி மட்டும் நிலையை மாற்ற முடியும்' : 'Only admins can change status') : ''}
            >
              <option value="pending">{t.pending || 'Pending'}</option>
              <option value="in_progress">{t.in_progress || 'In Progress'}</option>
              <option value="completed">{t.completed || 'Completed'}</option>
            </select>
            {!isAdmin && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <FaLock className="text-gray-400 text-sm" />
              </div>
            )}
          </div>
          {!isAdmin && (
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <FaLock className="text-xs" />
              {language === 'ta' ? 'நிலையை மாற்ற நிர்வாகி அனுமதி தேவை' : 'Admin permission required to change status'}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t border-gray-200">
        <button 
          type="submit" 
          disabled={saving}
          className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <>
              <FaSpinner className="animate-spin" />
              {language === 'ta' ? 'சேமிக்கிறது...' : 'Saving...'}
            </>
          ) : (
            <>
              <FaCheckCircle />
              {editingOrder ? t.updateOrder : t.createOrderBtn}
            </>
          )}
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          className="btn-secondary flex-1"
          disabled={saving}
        >
          {t.cancel}
        </button>
      </div>
    </form>
  )
}

// Order Card Sub-component
const OrderCard = ({ order, t, language, onEdit, onDelete, isAdmin }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100">
    {/* Admin-only: Show who created the order */}
    {isAdmin && order.created_by && (
      <div className="mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2 text-sm">
          <FaUser className="text-blue-500" />
          <span className="text-gray-600">
            {language === 'ta' ? 'ஆர்டர் உருவாக்குபவர்:' : 'Order created by:'}
          </span>
          <span className="font-semibold text-gray-800">{order.created_by.name}</span>
          <span className="flex items-center gap-1 text-gray-500">
            <FaEnvelope className="text-xs" />
            {order.created_by.email}
          </span>
        </div>
      </div>
    )}

    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-semibold text-gray-800">{order.customer_name}</h3>
        <p className="text-gray-600 mt-1">
          <span className="font-medium text-primary-600">{order.item_type || 'N/A'}</span>
          {order.item_description && ` - ${order.item_description}`}
        </p>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => onEdit(order)} 
          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
          title={language === 'ta' ? 'திருத்து' : 'Edit'}
        >
          <FaEdit />
        </button>
        {isAdmin && (
          <button 
            onClick={() => onDelete(order.id)} 
            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            title={language === 'ta' ? 'நீக்கு' : 'Delete'}
          >
            <FaTrash />
          </button>
        )}
      </div>
    </div>

    {order.measurements && Object.keys(order.measurements).length > 0 && (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        {Object.entries(order.measurements).map(([key, value]) => (
          <div key={key} className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 uppercase font-medium">{t[key] || key}</p>
            <p className="text-sm font-semibold text-gray-800">{value || 'N/A'}</p>
          </div>
        ))}
      </div>
    )}

    <div className="flex flex-wrap justify-between items-center text-sm text-gray-600 border-t border-gray-200 pt-4 gap-4">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-700">{t.status}:</span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
          order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {t[order.status] || order.status}
        </span>
        {!isAdmin && (
          <span className="text-xs text-gray-400" title={language === 'ta' ? 'நிலையை நிர்வாகி மட்டும் மாற்ற முடியும்' : 'Only admins can change status'}>
            <FaLock className="inline" />
          </span>
        )}
      </div>
      {order.due_date && (
        <div>
          <span className="font-semibold text-gray-700">{t.due}:</span> {formatDate(order.due_date)}
        </div>
      )}
      <div>
        <span className="font-semibold text-gray-700">{t.created}:</span> {formatDate(order.created_at)}
      </div>
    </div>
  </div>
)

export default Orders;
//