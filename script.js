
        // Global state management
        const state = {
            currentSection: 'dashboard',
            content: {
                articles: [],
                media: [],
                contact: {}
            }
        };

        // Navigation functionality
        document.addEventListener('DOMContentLoaded', function() {
            initializeNavigation();
            initializeDragAndDrop();
            updatePreview();
        });

        function initializeNavigation() {
            const navItems = document.querySelectorAll('.nav-item');
            const sections = document.querySelectorAll('.content-section');

            navItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Remove active class from all items
                    navItems.forEach(nav => nav.classList.remove('active'));
                    sections.forEach(section => section.classList.remove('active'));
                    
                    // Add active class to clicked item
                    this.classList.add('active');
                    
                    // Show corresponding section
                    const sectionId = this.getAttribute('data-section');
                    const targetSection = document.getElementById(sectionId);
                    if (targetSection) {
                        targetSection.classList.add('active');
                        state.currentSection = sectionId;
                    }
                });
            });
        }

        // Quick action navigation
        function navigateToSection(sectionId) {
            const navItems = document.querySelectorAll('.nav-item');
            const sections = document.querySelectorAll('.content-section');
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to target section
            const targetNav = document.querySelector(`[data-section="${sectionId}"]`);
            const targetSection = document.getElementById(sectionId);
            
            if (targetNav && targetSection) {
                targetNav.classList.add('active');
                targetSection.classList.add('active');
                state.currentSection = sectionId;
            }
        }

        // File upload functionality
        function initializeDragAndDrop() {
            const uploadZone = document.getElementById('uploadZone');
            
            uploadZone.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('dragover');
            });
            
            uploadZone.addEventListener('dragleave', function(e) {
                e.preventDefault();
                this.classList.remove('dragover');
            });
            
            uploadZone.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('dragover');
                
                const files = e.dataTransfer.files;
                handleFiles(files);
            });
        }

        function handleFileUpload(event) {
            const files = event.target.files;
            handleFiles(files);
        }

        function handleFiles(files) {
            const mediaGrid = document.getElementById('mediaGrid');
            
            Array.from(files).forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const mediaItem = createMediaItem(file.name, e.target.result, file.size);
                        mediaGrid.insertBefore(mediaItem, mediaGrid.firstChild);
                        updateStats();
                        showAlert('success', `${file.name} uploaded successfully!`);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        function createMediaItem(filename, src, size) {
            const div = document.createElement('div');
            div.className = 'media-item';
            div.innerHTML = `
                <div class="media-preview">
                    <img src="${src}" alt="${filename}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                </div>
                <div style="font-size: 0.875rem; color: var(--text-secondary);">
                    ${filename}<br>
                    ${formatFileSize(size)}
                </div>
            `;
            return div;
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        // Content editor functionality
        function formatText(command) {
            const textarea = document.getElementById('articleContent');
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const selectedText = text.substring(start, end);
            
            if (selectedText) {
                let formattedText = selectedText;
                switch(command) {
                    case 'bold':
                        formattedText = `**${selectedText}**`;
                        break;
                    case 'italic':
                        formattedText = `*${selectedText}*`;
                        break;
                    case 'underline':
                        formattedText = `<u>${selectedText}</u>`;
                        break;
                }
                
                textarea.value = text.substring(0, start) + formattedText + text.substring(end);
                textarea.focus();
                textarea.setSelectionRange(start, start + formattedText.length);
            }
        }

        function insertHeading() {
            const textarea = document.getElementById('articleContent');
            const start = textarea.selectionStart;
            const text = textarea.value;
            const beforeCursor = text.substring(0, start);
            const afterCursor = text.substring(start);
            
            const newText = beforeCursor + '\n\n## New Heading\n\n' + afterCursor;
            textarea.value = newText;
            textarea.focus();
            textarea.setSelectionRange(start + 4, start + 15);
        }

        // Save functions
        function saveContent() {
            const saveBtn = document.getElementById('saveContentText');
            const loading = document.getElementById('saveContentLoading');
            
            saveBtn.style.display = 'none';
            loading.style.display = 'inline-block';
            
            // Simulate API call
            setTimeout(() => {
                saveBtn.style.display = 'inline';
                loading.style.display = 'none';
                showAlert('success', 'Article saved successfully!');
                updatePreview();
                updateStats();
            }, 1500);
        }

        function saveContactInfo() {
            const saveBtn = document.getElementById('saveContactText');
            const loading = document.getElementById('saveContactLoading');
            
            saveBtn.style.display = 'none';
            loading.style.display = 'inline-block';
            
            // Simulate API call
            setTimeout(() => {
                saveBtn.style.display = 'inline';
                loading.style.display = 'none';
                showAlert('success', 'Contact information updated successfully!');
                updatePreview();
            }, 1200);
        }

        // Preview functionality
        function updatePreview() {
            const title = document.getElementById('articleTitle')?.value || '';
            const content = document.getElementById('articleContent')?.value || '';
            const companyName = document.getElementById('companyName')?.value || '';
            const email = document.getElementById('email')?.value || '';
            const phone = document.getElementById('phone')?.value || '';
            const address = document.getElementById('address')?.value || '';

            // Update preview elements
            const previewTitle = document.getElementById('previewArticleTitle');
            const previewContent = document.getElementById('previewArticleContent');
            const previewCompanyName = document.getElementById('previewCompanyName');
            const previewFooterName = document.getElementById('previewFooterName');
            const previewContactInfo = document.getElementById('previewContactInfo');

            if (previewTitle) previewTitle.textContent = title;
            if (previewCompanyName) previewCompanyName.textContent = companyName;
            if (previewFooterName) previewFooterName.textContent = companyName;
            
            if (previewContent && content) {
                const paragraphs = content.split('\n\n').filter(p => p.trim());
                previewContent.innerHTML = paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
            }

            if (previewContactInfo) {
                previewContactInfo.innerHTML = `
                    Email: ${email}<br>
                    Phone: ${phone}<br>
                    Address: ${address.replace(/\n/g, ', ')}
                `;
            }
        }

        function publishChanges() {
            showAlert('success', 'Changes published successfully! Your website is now live.');
        }

        // Utility functions
        function showAlert(type, message) {
            const alertId = type === 'success' ? 'successAlert' : 'errorAlert';
            const alert = document.getElementById(alertId);
            
            alert.textContent = message;
            alert.classList.add('show');
            
            setTimeout(() => {
                alert.classList.remove('show');
            }, 4000);
        }

        function updateStats() {
            const mediaItems = document.querySelectorAll('.media-item').length;
            const imagesCount = document.getElementById('imagesCount');
            if (imagesCount) {
                imagesCount.textContent = mediaItems;
            }
        }

        // Auto-save functionality
        let autoSaveTimeout;
        function autoSave() {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                // Auto-save logic here
                console.log('Auto-saving...');
            }, 30000); // Auto-save every 30 seconds
        }

        // Add auto-save listeners
        document.addEventListener('input', function(e) {
            if (e.target.matches('.form-input, .form-textarea, .form-select')) {
                autoSave();
            }
        });

        // Responsive navigation for mobile
        function toggleMobileNav() {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('mobile-open');
        }

        // Add mobile menu button if needed
        if (window.innerWidth <= 768) {
            const header = document.querySelector('.header');
            if (header) {
                const mobileMenuBtn = document.createElement('button');
                mobileMenuBtn.className = 'btn btn-secondary';
                mobileMenuBtn.innerHTML = '☰ Menu';
                mobileMenuBtn.onclick = toggleMobileNav;
                header.appendChild(mobileMenuBtn);
            }
        }
