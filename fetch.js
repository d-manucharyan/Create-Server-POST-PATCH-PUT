//! POST
fetch('http://localhost:3000/api/users', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
        id: 2,
        name: 'Grigor',
        age: 24,
        email: 'grigor@gmail.com'
    })
})
    .then(res => res.json())
    .then(res => console.log(res))


//! DELETE

fetch('http://localhost:3000/api/users/5', {
    method: 'DELETE',
    headers: { 'content-type': 'application/json' }
})
    .then(res => res.json())
    .then(data => console.log(data))


//! PATCH

fetch('http://localhost:3000/api/users/10', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ age: 45 })
})
    .then(res => res.json())
    .then(data => console.log(data))

//! PUT

fetch('http://localhost:3000/api/users/10', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: 'David',
        email: 'manuch@gmail.com'
    })
})