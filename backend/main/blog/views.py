from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import LoginSerializer, UserRegistrationSerializer
from rest_framework.permissions import AllowAny  # This allows unauthenticated access
from rest_framework.authentication import SessionAuthentication, BasicAuthentication


class UserRegistrationView(APIView):
    permission_classes = [
        AllowAny
    ]  # Allow unauthenticated users to access registration view
    authentication_classes = []  # No authentication needed for registration

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully!"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    View to handle user login and token retrieval.
    """

    permission_classes = [
        AllowAny
    ]  # Allow unauthenticated users to access registration view
    authentication_classes = []  # No authentication needed for registration

    def post(self, request):
        """
        Authenticate user and return a token.
        """
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():  # Validates username and password presence
            username = serializer.validated_data["username"]
            password = serializer.validated_data["password"]
            user = authenticate(username=username, password=password)

            if user:
                # Generate or retrieve the token
                token, _ = Token.objects.get_or_create(user=user)
                return Response({"token": token.key}, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Invalid credentials"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    """
    View to handle fetching and updating the authenticated user's profile.
    Only the authenticated user can modify their own profile.
    """

    permission_classes = [
        IsAuthenticated
    ]  # Only authenticated users can access this view

    def get(self, request):
        """
        Return the profile of the authenticated user.
        """
        serializer = UserRegistrationSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        """
        Update the profile of the authenticated user.
        """
        serializer = UserRegistrationSerializer(
            request.user, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile updated successfully!"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
