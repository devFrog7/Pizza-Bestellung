let isAnimating = false;
let currentView = 'login';

function getSwing3Position(isRegister) {
    return isRegister ? '0%' : '50%';
}

document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('animated');
    
    const loginHeader = document.querySelector('.login-header');
    const loginBody = document.querySelector('.login-body');
    const loginFooter = document.querySelector('.login-footer');
    
    loginHeader.style.opacity = '1';
    loginBody.style.opacity = '1';
    loginFooter.style.opacity = '1';
});

function animateOut(elements) {
    elements.forEach(el => {
        el.classList.remove('fade-in');
        el.style.opacity = '1';
        
        void el.offsetWidth;
    });
    
    setTimeout(() => {
        elements[0].classList.add('fade-out', 'delay-1');
        elements[1].classList.add('fade-out', 'delay-2');
        elements[2].classList.add('fade-out', 'delay-3');
     }, 50);
    
    setTimeout(() => {
    }, 50);
}

function animateIn(elements) {
    elements.forEach(el => {
        el.classList.remove('fade-out');
        el.style.opacity = '0';
        
        void el.offsetWidth;
    });
    
    setTimeout(() => {
        elements[0].classList.add('fade-in', 'delay-1');
        elements[1].classList.add('fade-in', 'delay-2');
        elements[2].classList.add('fade-in', 'delay-3');
    }, 50);
}

document.querySelector('.register-link').addEventListener('click', function(e) {
    e.preventDefault();
    
    if (isAnimating || currentView === 'register') return;
    isAnimating = true;
    currentView = 'register';
    
    const swing3 = document.querySelector('.swing3');
    
    const loginElements = [
        document.querySelector('.login-header'),
        document.querySelector('.login-body'),
        document.querySelector('.login-footer')
    ];
    
    animateOut(loginElements);
    
    document.querySelector('.login-info').style.display = 'none';
    document.querySelector('.register-info').style.display = 'block';
    
    swing3.style.marginLeft = getSwing3Position(true);
    swing3.style.borderTopRightRadius = '0px';
    swing3.style.borderBottomRightRadius = '0px';
    swing3.style.borderTopLeftRadius = '10px';
    swing3.style.borderBottomLeftRadius = '10px';
    
    swing3.style.boxShadow = '20px 0px 20px rgba(0, 0, 0, 0.2)';
    
    setTimeout(() => {
        const registerElements = [
            document.querySelector('.register-header'),
            document.querySelector('.register-body'),
            document.querySelector('.register-footer')
        ];
        
        animateIn(registerElements);
        
        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }, 500);
});

document.querySelector('.login-link').addEventListener('click', function(e) {
    e.preventDefault();
    
    if (isAnimating || currentView === 'login') return;
    isAnimating = true;
    currentView = 'login';
    
    const swing3 = document.querySelector('.swing3');
    
    const registerElements = [
        document.querySelector('.register-header'),
        document.querySelector('.register-body'),
        document.querySelector('.register-footer')
    ];
    
    animateOut(registerElements);
    
    document.querySelector('.register-info').style.display = 'none';
    document.querySelector('.login-info').style.display = 'block';
    
    swing3.style.marginLeft = getSwing3Position(false);
    swing3.style.borderTopRightRadius = '10px';
    swing3.style.borderBottomRightRadius = '10px';
    swing3.style.borderTopLeftRadius = '0px';
    swing3.style.borderBottomLeftRadius = '0px';
    
    swing3.style.boxShadow = '-20px 0px 20px rgba(0, 0, 0, 0.2)';
    
    setTimeout(() => {
        const loginElements = [
            document.querySelector('.login-header'),
            document.querySelector('.login-body'),
            document.querySelector('.login-footer')
        ];
        
        animateIn(loginElements);
        
        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }, 500);
});