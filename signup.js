const username = document.getElementById('username')
const password = document.getElementById('password')
const confirmpassword = document.getElementById('confirmpassword')


document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    if (password.value != confirmpassword.value) {
        document.getElementById('notifbody').style = `display:flex;background-color: rgb(219, 71, 71);`
        document.getElementById('message').textContent = 'Password not match!'
        setTimeout(() => {
            document.getElementById('notifbody').style = `display:none`
        }, 1500);
    } else {
        const signup = await fetch('https://job-applying-manager.onrender.com/signup', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username.value, password: password.value })
        })
        const data = await signup.json()
        if (signup.ok) {
            console.log(data.message)
            document.getElementById('notifbody').style = `display:flex; background-color: rgb(66, 226, 146);`
            document.getElementById('message').textContent = data.message
            setTimeout(() => {
                document.getElementById('notifbody').style = `display:none`
                window.location.replace('login.html')
            }, 1500);

        }
        else {
            console.log(data.message)
            document.getElementById('notifbody').style = `display:flex;background-color: rgb(219, 71, 71);`
            document.getElementById('message').textContent = data.message
            setTimeout(() => {
                document.getElementById('notifbody').style = `display:none`
            }, 1500);
        }
    }
})
