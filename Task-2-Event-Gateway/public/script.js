document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const resultArea = document.getElementById('result-area');
    const statusMessage = document.getElementById('status-message');
    const successDisplay = document.getElementById('success-display');
    const qrcodeContainer = document.getElementById('qrcode');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous results
        successDisplay.classList.add('hidden');
        qrcodeContainer.innerHTML = '';
        statusMessage.textContent = '';
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const registrationId = document.getElementById('registrationId').value;

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, registrationId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'An unknown error occurred.');
            }

            // --- SUCCESS ---
            form.classList.add('hidden');
            resultArea.classList.remove('hidden');
            successDisplay.classList.remove('hidden'); // Only show QR box on success
            
            statusMessage.textContent = data.message; // Use the message from the server
            statusMessage.className = 'success';
            
            new QRCode(qrcodeContainer, {
                text: data.token,
                width: 256,
                height: 256,
            });

        } catch (error) {
            // --- ERROR ---
            resultArea.classList.remove('hidden');
            statusMessage.textContent = `Error: ${error.message}`;
            statusMessage.className = 'error';
        }
    });
});