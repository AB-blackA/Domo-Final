// new job property added (it's just another property of a Domo) and a Delete functionality

const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const job = e.target.querySelector('#domoJob').value;

    if (!name || !age || !job) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { name, age, job }, onDomoAdded);
    return false;
}

// handleTermination is my addition for a new feature
// it deletes domos, or 'terminates them' since a job property was added
// it's basically modeled after handleDomo but is passed in domo data automatically
// so we don't have to find it anywhere
const handleTermination = (domo, onDomoDelete) =>{

    helper.hideError();

    // debugging. Mongo is very picky about _id vs id and whether its in an object or not...
    console.log(domo._id);

    // new sendDelete in helper
    helper.sendDelete('/deleteDomo', {id: domo._id}, onDomoDelete);
    return false;
}

// you'll notice the Domo Job being added in at various points
const DomoForm = (props) => {
    return (
        <form id='domoForm'
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name='domoForm'
            action='/maker'
            method='POST'
            className='domoForm'
        >
            <label htmlFor='name'>Name: </label>
            <input id='domoName' type='text' name='name' placeholder='Domo Name' />
            <label htmlFor='age'>Age: </label>
            <input id='domoAge' type='number' min='0' name='age' />
            <label htmlFor='job'>Job: </label>
            <input id='domoJob' type='text' name='job' placeholder='Domo Job'/>
            <input className='makeDomoSubmit' type='submit' value='Make Domo' />
        </form>
    );
};

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    if (domos.length === 0) {
        return (
            <div className='domoList'>
                <h3 className='emptyDomo'>No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = domos.map(domo => {
        return (
            <div key={domo.id} className='domo'>
                <img src='/assets/img/domoface.jpeg' alt='domo face' className='domoFace' />
                <h3 className='domoName'>Name: {domo.name}</h3>
                <h3 className='domoAge'>Age: {domo.age}</h3>
                <h3 className='domoJob'>Job: {domo.job}</h3>
                <button
                    className='deleteButton'
                    onClick={() => handleTermination(domo, props.triggerReload)}>
                    Fire Domo
                </button>
            </div>
        );
    });

    return (
        <div className='domoList'>
            {domoNodes}
        </div>
    );
};

// App was slightly modified to add the triggerReload to DomoList so it would
// update on deletion
const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id='makeDomo'>
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id='domos'>
                <DomoList domos={[]} reloadDomos={reloadDomos} triggerReload={() => setReloadDomos(!reloadDomos)}/>
            </div>
        </div>
    );
}

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;