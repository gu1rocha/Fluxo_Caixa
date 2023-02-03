const themeToggler = document.querySelector(".theme-btn");

let TogglerTheme = () => {
    document.body.classList.toggle('dark-theme-variables');
    if(document.body.classList.value !== ''){
        localStorage.setItem('theme','dark')
    }else{
        localStorage.setItem('theme','white')
    }

    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
}

themeToggler.addEventListener('click', TogglerTheme);

if(localStorage.getItem("theme") === 'dark'){
    document.body.classList.toggle('dark-theme-variables');

    themeToggler.querySelector('span:nth-child(1)').classList.remove('active');
    themeToggler.querySelector('span:nth-child(2)').classList.add('active');
}