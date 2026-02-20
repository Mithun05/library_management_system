from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.utils import timezone
from .models import Book, Member, BookCopy, MemberBookCheckout
from .serializers import BookSerializer, MemberSerializer, MemberBookCheckoutSerializer
from .services import LibraryService

class BookViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Books to be created or updated.
    Methods: POST (Create), PUT/PATCH (Update), GET (List/Retrieve)
    """
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def perform_create(self, serializer):
        # Extract the number of copies from the validated data
        num_copies = serializer.validated_data.pop('number_of_copies', 1)
        
        # Use service to handle book + copies creation
        LibraryService.create_book_with_copies(
            serializer.validated_data, 
            num_copies
        )

class MemberViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Members to be created or updated.
    Methods: POST (Create), PUT/PATCH (Update), GET (List/Retrieve)
    """
    queryset = Member.objects.all()
    serializer_class = MemberSerializer

class LoanViewSet(viewsets.GenericViewSet):
    queryset = MemberBookCheckout.objects.all()
    serializer_class = MemberBookCheckoutSerializer

    @action(detail=False, methods=['post'])
    def borrow(self, request):
        try:
            loan = LibraryService.borrow_book(
                request.data.get('book_uid'),
                request.data.get('member_id'),
                request.data.get('staff_name')
            )
            return Response({"status": "Borrowed"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def return_item(self, request):
        try:
            LibraryService.return_book(request.data.get('book_uid'))
            return Response({"status": "Returned"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def member_loans(self, request):
        loans = MemberBookCheckout.objects.filter(
            member__member_id=request.query_params.get('member_id'), 
            is_returned=False
        )
        return Response(MemberBookCheckoutSerializer(loans, many=True).data)        