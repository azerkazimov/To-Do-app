// Получаем элементы формы
const form = document.querySelector('.login-form'); 
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitButton = document.querySelector('.submit-button');
const emailError = document.querySelector('.error-text_email');
const passwordError = document.querySelector('.error-text_password');

// Проверяем, что элементы найдены
console.log('🔍 Проверка элементов:');
console.log('Form:', form);
console.log('Email input:', emailInput);
console.log('Password input:', passwordInput);
console.log('Submit button:', submitButton);


// Объект для хранения состояния валидации
const validation = {
    email: false,
    password: false
};


// Функции валидации
function validateEmail(email, showError = false) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email) && email.length > 0;
    
    validation.email = isValid;
    
    if (showError) {
        if (!isValid) {
            showFieldError(emailInput, emailError, 'Введите корректный email');
        } else {
            showFieldSuccess(emailInput, emailError);
        }
    }
    
    return isValid;
}

function validatePassword(password, showError = false) {
    const isValid = password.length >= 6;
    
    validation.password = isValid;
    
    if (showError) {
        if (!isValid) {
            showFieldError(passwordInput, passwordError, 'Пароль должен быть не менее 6 символов');
        } else {
            showFieldSuccess(passwordInput, passwordError);
        }
    }
    
    return isValid;
}

// Функции для работы с интерфейсом
function showFieldError(input, errorElement, message) {
    if (input && errorElement) {
        input.classList.remove('success');
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function showFieldSuccess(input, errorElement) {
    if (input && errorElement) {
        input.classList.remove('error');
        input.classList.add('success');
        errorElement.classList.remove('show');
    }
}

function clearFieldError(input, errorElement) {
    if (input && errorElement) {
        input.classList.remove('error', 'success');
        errorElement.classList.remove('show');
    }
}

function clearForm() {
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';
    clearFieldError(emailInput, emailError);
    clearFieldError(passwordInput, passwordError);
    validation.email = false;
    validation.password = false;
    updateSubmitButton();
    console.log('🧹 Форма очищена');
}

function updateSubmitButton() {
    const isFormValid = validation.email && validation.password;
    if (submitButton) {
        submitButton.disabled = !isFormValid;
    }
}

// Функция логина (имитация)
async function loginUser() {
    console.log('🔐 Начинаем процесс логина...');
    
    if (!submitButton) {
        console.error('❌ Кнопка submit не найдена');
        return;
    }
    
    // Показываем индикатор загрузки
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    try {
        // Имитируем запрос к серверу
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Получаем данные формы
        const formData = {
            email: emailInput?.value || '',
            password: passwordInput?.value || ''
        };
        
        console.log('📤 Отправляем данные:', formData);
        
        // Простая проверка логина
        if (formData.email === 'admin@example.com' && formData.password === '123456') {
            console.log('✅ Логин успешен!');
            
            // Сохраняем данные пользователя в localStorage
            sessionStorage.setItem('user', JSON.stringify({
                email: formData.email,
                loginTime: new Date().toISOString()
            }));
            
            showNotification('Добро пожаловать! Перенаправление...', 'success');
            
            // Перенаправление на todo.html
            setTimeout(() => {
                console.log('🔄 Перенаправление на todo.html...');
                window.location.href = 'todo.html';
            }, 1500);
            
        } else {
            throw new Error('Неверный email или пароль');
        }
        
    } catch (error) {
        console.log('❌ Ошибка логина:', error.message);
        showNotification(error.message, 'error');
    } finally {
        // Убираем индикатор загрузки
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
    }
}

// Функция показа уведомлений
function showNotification(message, type = 'success') {
    // Удаляем существующие уведомления
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Добавляем стили для уведомлений
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);' : 'background: #ff6b6b;'}
    `;
    
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Убираем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// 1. СОБЫТИЕ INPUT - валидация в реальном времени
emailInput?.addEventListener('input', (e) => {
    console.log('🎯 Событие INPUT на email:', e.target.value);
    validateEmail(e.target.value);
    updateSubmitButton();
});

passwordInput?.addEventListener('input', (e) => {
    console.log('🎯 Событие INPUT на password:', e.target.value.replace(/./g, '*'));
    validatePassword(e.target.value);
    updateSubmitButton();
});

// 2. СОБЫТИЕ BLUR - валидация при потере фокуса
emailInput?.addEventListener('blur', (e) => {
    console.log('👁️ Событие BLUR на email');
    validateEmail(e.target.value, true);
});

passwordInput?.addEventListener('blur', (e) => {
    console.log('👁️ Событие BLUR на password');
    validatePassword(e.target.value, true);
});

// 3. СОБЫТИЕ FOCUS - очистка ошибок при получении фокуса
emailInput?.addEventListener('focus', (e) => {
    console.log('🎯 Событие FOCUS на email');
    clearFieldError(emailInput, emailError);
});

passwordInput?.addEventListener('focus', (e) => {
    console.log('🎯 Событие FOCUS на password');
    clearFieldError(passwordInput, passwordError);
});

// 4. СОБЫТИЕ SUBMIT - ИСПРАВЛЕННАЯ ВЕРСИЯ
form?.addEventListener('submit', function(e) {
    console.log('🚀 Событие SUBMIT формы');
    
    // КРИТИЧЕСКИ ВАЖНО: останавливаем стандартную отправку формы
    e.preventDefault();
    e.stopPropagation();
    
    console.log('✋ preventDefault() выполнен');
    
    // Валидируем все поля перед отправкой
    const emailValid = validateEmail(emailInput.value, true);
    const passwordValid = validatePassword(passwordInput.value, true);
    
    if (emailValid && passwordValid) {
        loginUser();
    } else {
        console.log('❌ Форма не прошла валидацию');
        showNotification('Исправьте ошибки в форме', 'error');
    }
    
    // Возвращаем false для дополнительной защиты
    return false;
});

// 5. СОБЫТИЯ КЛАВИАТУРЫ - горячие клавиши
document.addEventListener('keydown', (e) => {
    // Enter в любом поле = отправка формы
    if (e.key === 'Enter' && (e.target === emailInput || e.target === passwordInput)) {
        console.log('⌨️ Событие KEYDOWN: Enter');
        e.preventDefault();
        if (form) {
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            form.dispatchEvent(submitEvent);
        }
    }
    
    // Escape = очистка формы
    if (e.key === 'Escape') {
        console.log('⌨️ Событие KEYDOWN: Escape');
        clearForm();
    }
});


// 6. СОБЫТИЕ LOAD - инициализация при загрузке страницы
window.addEventListener('load', () => {
    console.log('🌍 Событие LOAD: страница загружена');
    
    // Проверяем, есть ли уже авторизованный пользователь
    const user = sessionStorage.getItem('user');
    if (user) {
        console.log('👤 Найден авторизованный пользователь');
        showNotification('Вы уже авторизованы! Перенаправление...', 'success');
        setTimeout(() => {
            window.location.href = 'todo.html';
        }, 1500);
        return;
    }
    
    // Устанавливаем фокус на поле email
    if (emailInput) {
        emailInput.focus();
    }
});

// Демо данные для тестирования
console.log('🎓 ДЕМО ДАННЫЕ ДЛЯ ТЕСТИРОВАНИЯ:');
console.log('Email: admin@example.com');
console.log('Password: 123456');
console.log('');
console.log('📚 СОБЫТИЯ, КОТОРЫЕ МОЖНО НАБЛЮДАТЬ:');
console.log('1. input - при вводе текста');
console.log('2. focus/blur - при получении/потере фокуса');
console.log('3. submit - при отправке формы');
console.log('4. keydown - при нажатии клавиш');
console.log('5. load - при загрузке страницы');