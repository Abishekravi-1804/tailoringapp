"""
AWS Cognito Authentication Helper
Handles user signup, login, verification, and token validation
"""
import boto3
import hmac
import hashlib
import base64
import os
from botocore.exceptions import ClientError
from dotenv import load_dotenv
from jose import jwt, JWTError
import requests

load_dotenv()

class AWSCognito:
    """AWS Cognito authentication service"""
    
    def __init__(self):
        self.user_pool_id = os.getenv("COGNITO_USER_POOL_ID")
        self.client_id = os.getenv("COGNITO_CLIENT_ID")
        self.client_secret = os.getenv("COGNITO_CLIENT_SECRET")
        self.region = os.getenv("AWS_REGION", "us-east-1")
        
        # Initialize Cognito client
        self.client = boto3.client(
            'cognito-idp',
            region_name=self.region,
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
        )
        
        print(f"🔧 Cognito Initialized:")
        print(f"   Region: {self.region}")
        print(f"   User Pool: {self.user_pool_id}")
        print(f"   Client ID: {self.client_id}")
        print(f"   Client Secret: {'Yes' if self.client_secret else 'No'}")
    
    def _get_secret_hash(self, username: str):
        """Generate secret hash for Cognito client"""
        if not self.client_secret:
            return None
        
        try:
            message = bytes(username + self.client_id, 'utf-8')
            key = bytes(self.client_secret, 'utf-8')
            secret_hash = base64.b64encode(
                hmac.new(key, message, digestmod=hashlib.sha256).digest()
            ).decode()
            return secret_hash
        except Exception as e:
            print(f"❌ Error generating secret hash: {e}")
            return None
    
    def sign_up(self, email: str, password: str, name: str, phone: str = None):
        """
        Register a new user in Cognito
        """
        try:
            print(f"\n🔄 Calling AWS Cognito sign_up...")
            print(f"   Email (username): {email}")
            
            # Build user attributes
            user_attributes = [
                {'Name': 'email', 'Value': email},
                {'Name': 'name', 'Value': name}
            ]
            
            # Add phone if provided and valid
            if phone and phone.strip():
                # Ensure phone is in E.164 format (+CountryCodeNumber)
                if not phone.startswith('+'):
                    phone = '+91' + phone  # Add India country code if not present
                user_attributes.append({'Name': 'phone_number', 'Value': phone})
                print(f"   Phone: {phone}")
            
            # Build request parameters
            params = {
                'ClientId': self.client_id,
                'Username': email,
                'Password': password,
                'UserAttributes': user_attributes
            }
            
            # Add secret hash if client secret is configured
            secret_hash = self._get_secret_hash(email)
            if secret_hash:
                params['SecretHash'] = secret_hash
                print(f"   ✅ Secret hash generated")
            else:
                print(f"   ℹ️  No client secret configured")
            
            print(f"\n📤 Sending request to Cognito...")
            response = self.client.sign_up(**params)
            
            print(f"✅ Cognito API call successful!")
            print(f"   User Sub: {response['UserSub']}")
            
            return {
                'success': True,
                'message': 'User registered successfully. Please check your email for verification code.',
                'user_sub': response['UserSub'],
                'code_delivery': response.get('CodeDeliveryDetails', {})
            }
        
        except ClientError as e:
            error_code = e.response['Error']['Code']
            error_message = e.response['Error']['Message']
            
            print(f"\n❌ Cognito ClientError:")
            print(f"   Code: {error_code}")
            print(f"   Message: {error_message}")
            
            # Map Cognito errors to user-friendly messages
            if error_code == 'UsernameExistsException':
                message = 'An account with this email already exists'
            elif error_code == 'InvalidPasswordException':
                message = 'Password must be at least 8 characters with uppercase, lowercase, number and special character'
            elif error_code == 'InvalidParameterException':
                message = f'Invalid input: {error_message}'
            elif error_code == 'NotAuthorizedException':
                message = 'Not authorized to perform this action'
            elif error_code == 'UserLambdaValidationException':
                message = f'Validation failed: {error_message}'
            else:
                message = f'Signup failed: {error_message}'
            
            return {'success': False, 'message': message}
        
        except Exception as e:
            print(f"\n💥 Unexpected error: {type(e).__name__}")
            print(f"   Message: {str(e)}")
            return {'success': False, 'message': f'Unexpected error: {str(e)}'}
    
    def confirm_sign_up(self, email: str, confirmation_code: str):
        """Confirm user email with verification code"""
        try:
            params = {
                'ClientId': self.client_id,
                'Username': email,
                'ConfirmationCode': confirmation_code
            }
            
            secret_hash = self._get_secret_hash(email)
            if secret_hash:
                params['SecretHash'] = secret_hash
            
            self.client.confirm_sign_up(**params)
            
            return {
                'success': True,
                'message': 'Email verified successfully! You can now login.'
            }
        
        except ClientError as e:
            error_code = e.response['Error']['Code']
            
            if error_code == 'CodeMismatchException':
                message = 'Invalid verification code. Please try again.'
            elif error_code == 'ExpiredCodeException':
                message = 'Verification code has expired. Please request a new one.'
            elif error_code == 'NotAuthorizedException':
                message = 'User is already confirmed.'
            else:
                message = f'Verification failed: {e.response["Error"]["Message"]}'
            
            return {'success': False, 'message': message}
        
        except Exception as e:
            return {'success': False, 'message': f'Unexpected error: {str(e)}'}
    
    def resend_confirmation_code(self, email: str):
        """Resend verification code to user's email"""
        try:
            params = {
                'ClientId': self.client_id,
                'Username': email
            }
            
            secret_hash = self._get_secret_hash(email)
            if secret_hash:
                params['SecretHash'] = secret_hash
            
            response = self.client.resend_confirmation_code(**params)
            
            return {
                'success': True,
                'message': 'Verification code resent to your email',
                'code_delivery': response.get('CodeDeliveryDetails', {})
            }
        
        except ClientError as e:
            return {
                'success': False,
                'message': f'Failed to resend code: {e.response["Error"]["Message"]}'
            }
    
    def sign_in(self, email: str, password: str):
        """Authenticate user and get tokens"""
        try:
            params = {
                'ClientId': self.client_id,
                'AuthFlow': 'USER_PASSWORD_AUTH',
                'AuthParameters': {
                    'USERNAME': email,
                    'PASSWORD': password
                }
            }
            
            secret_hash = self._get_secret_hash(email)
            if secret_hash:
                params['AuthParameters']['SECRET_HASH'] = secret_hash
            
            response = self.client.initiate_auth(**params)
            
            auth_result = response['AuthenticationResult']
            
            # Get user details from ID token
            id_token = auth_result['IdToken']
            user_info = jwt.get_unverified_claims(id_token)
            
            return {
                'success': True,
                'tokens': {
                    'access_token': auth_result['AccessToken'],
                    'id_token': id_token,
                    'refresh_token': auth_result.get('RefreshToken'),
                    'expires_in': auth_result['ExpiresIn'],
                    'token_type': auth_result['TokenType']
                },
                'user': {
                    'sub': user_info.get('sub'),
                    'email': user_info.get('email'),
                    'name': user_info.get('name'),
                    'email_verified': user_info.get('email_verified', False)
                }
            }
        
        except ClientError as e:
            error_code = e.response['Error']['Code']
            
            if error_code == 'UserNotConfirmedException':
                message = 'Please verify your email first. Check your inbox for verification code.'
            elif error_code == 'NotAuthorizedException':
                message = 'Incorrect email or password'
            elif error_code == 'UserNotFoundException':
                message = 'No account found with this email'
            else:
                message = f'Login failed: {e.response["Error"]["Message"]}'
            
            return {'success': False, 'message': message}
        
        except Exception as e:
            return {'success': False, 'message': f'Unexpected error: {str(e)}'}
    
    def get_user(self, access_token: str):
        """Get user details from access token"""
        try:
            response = self.client.get_user(AccessToken=access_token)
            
            # Parse user attributes
            user_attributes = {
                attr['Name']: attr['Value']
                for attr in response['UserAttributes']
            }
            
            return {
                'success': True,
                'user': {
                    'username': response['Username'],
                    'email': user_attributes.get('email'),
                    'name': user_attributes.get('name'),
                    'phone': user_attributes.get('phone_number'),
                    'email_verified': user_attributes.get('email_verified') == 'true',
                    'sub': user_attributes.get('sub')
                }
            }
        
        except ClientError as e:
            return {
                'success': False,
                'message': f'Token validation failed: {e.response["Error"]["Message"]}'
            }
        
        except Exception as e:
            return {'success': False, 'message': f'Unexpected error: {str(e)}'}
    
    def refresh_token(self, refresh_token: str):
        """Refresh access token using refresh token"""
        try:
            params = {
                'ClientId': self.client_id,
                'AuthFlow': 'REFRESH_TOKEN_AUTH',
                'AuthParameters': {
                    'REFRESH_TOKEN': refresh_token
                }
            }
            
            response = self.client.initiate_auth(**params)
            auth_result = response['AuthenticationResult']
            
            return {
                'success': True,
                'tokens': {
                    'access_token': auth_result['AccessToken'],
                    'id_token': auth_result['IdToken'],
                    'expires_in': auth_result['ExpiresIn']
                }
            }
        
        except ClientError as e:
            return {
                'success': False,
                'message': f'Token refresh failed: {e.response["Error"]["Message"]}'
            }

# Initialize Cognito service
cognito_service = AWSCognito()
