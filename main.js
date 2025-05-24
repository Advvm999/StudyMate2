// Main JavaScript file for StudyMate

document.addEventListener('DOMContentLoaded', function() {
    // Flash messages auto-hide
    const flashMessages = document.querySelectorAll('.flash-message');
    if (flashMessages.length > 0) {
        flashMessages.forEach(message => {
            setTimeout(() => {
                message.style.opacity = '0';
                setTimeout(() => {
                    message.style.display = 'none';
                }, 500);
            }, 5000);
        });
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Tool filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const toolCards = document.querySelectorAll('.tool-card');
    
    if (filterButtons.length > 0 && toolCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.textContent.trim();
                
                // Show all tools if "All" is selected
                if (filter === 'الكل' || filter === 'All') {
                    toolCards.forEach(card => {
                        card.style.display = 'block';
                    });
                } else {
                    // Filter tools based on category
                    toolCards.forEach(card => {
                        const category = card.querySelector('.tool-category').textContent.trim();
                        if (category === filter) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    }

    // Form validation
    const forms = document.querySelectorAll('form');
    
    if (forms.length > 0) {
        forms.forEach(form => {
            form.addEventListener('submit', function(event) {
                const requiredFields = form.querySelectorAll('[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('error');
                        
                        // Create error message if it doesn't exist
                        let errorMessage = field.nextElementSibling;
                        if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                            errorMessage = document.createElement('div');
                            errorMessage.classList.add('error-message');
                            errorMessage.textContent = 'هذا الحقل مطلوب';
                            field.parentNode.insertBefore(errorMessage, field.nextSibling);
                        }
                    } else {
                        field.classList.remove('error');
                        
                        // Remove error message if it exists
                        const errorMessage = field.nextElementSibling;
                        if (errorMessage && errorMessage.classList.contains('error-message')) {
                            errorMessage.remove();
                        }
                    }
                });
                
                if (!isValid) {
                    event.preventDefault();
                }
            });
        });
    }

    // AI Tools functionality
    const aiGenerateForm = document.getElementById('ai-generate-form');
    
    if (aiGenerateForm) {
        aiGenerateForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const contentInput = document.getElementById('ai-content');
            const resultContainer = document.getElementById('ai-result');
            const loadingIndicator = document.getElementById('ai-loading');
            
            if (contentInput && resultContainer && loadingIndicator) {
                const content = contentInput.value.trim();
                
                if (!content) {
                    alert('الرجاء إدخال محتوى للمعالجة');
                    return;
                }
                
                // Show loading indicator
                loadingIndicator.style.display = 'block';
                resultContainer.innerHTML = '';
                
                // Send request to AI API
                fetch('/api/ai/generate_notes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ content: content })
                })
                .then(response => response.json())
                .then(data => {
                    // Hide loading indicator
                    loadingIndicator.style.display = 'none';
                    
                    if (data.success) {
                        resultContainer.innerHTML = `<div class="ai-result-content">${data.notes}</div>`;
                    } else {
                        resultContainer.innerHTML = `<div class="ai-result-error">حدث خطأ أثناء معالجة المحتوى</div>`;
                    }
                })
                .catch(error => {
                    // Hide loading indicator
                    loadingIndicator.style.display = 'none';
                    resultContainer.innerHTML = `<div class="ai-result-error">حدث خطأ في الاتصال: ${error.message}</div>`;
                });
            }
        });
    }
});
