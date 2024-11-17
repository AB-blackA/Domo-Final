/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('domoMessage').classList.remove('hidden');
};

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    document.getElementById('domoMessage').classList.add('hidden');

    if (result.redirect) {
        window.location = result.redirect;
    }

    if (result.error) {
        handleError(result.error);
    }

    if (handler) {
        handler(result);
    }
};


// Send Delete (maybe it should just be 'delete'?) sends a delete request to remove a Domo from
// the mongo database. It is modeled after sendPost method and im thankful it didn't require much
// change since finding tutorials on DELETE functionality in a well-explained manner wasn't easy.
// i read this: https://apidog.com/blog/javascript-http-delete/
// which helped a little but mostly i achieve this through hoping it was similar enough to sendPost
// and banging the head against the keyboard a bit
const sendDelete = async (url, data, handler) => {

    //console.log('start of sendDelete');

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    //console.log('Data sent:', data);

    const result = await response.json();

    //console.log('after result is assigned');
    document.getElementById('domoMessage').classList.add('hidden');

    if (result.redirect) {
        window.location = result.redirect;
    }

    if (result.error) {
        handleError(result.error);
    }

    if (handler) {
        handler(result);
    }

    //console.log('end of sendDelete');
};


const hideError = () => {
    document.getElementById('domoMessage').classList.add('hidden');
};

module.exports = {
    handleError,
    sendPost,
    hideError,
    sendDelete
};