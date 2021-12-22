const inquirer = require('inquirer');
const ListPrompt = require('inquirer/lib/prompts/list');
require('colors');

const menuOpt = [
    {
        type: 'list',
        name: 'option',
        message: 'Select your option',
        choices: [
        {
            value: 1,
            name: `${'1-'.green} Search city`
        },
        {
            value: 2,
            name: `${'2-'.green} Records`
        },
        {
            value: 0,
            name: `${'0-'.green} Exit`
        }
    ]
    }
]

const inquireMenu = async () => {
    console.clear();
    console.log('======================'.green);
    console.log('Select your option');
    console.log('======================\n'.green);
    const {option} = await inquirer.prompt(menuOpt);
    return option;

}

const pause = async () => {
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Press ${'ENTER'.green} to continue\n`
        }
    ]
    console.log('\n');
    await inquirer.prompt(question);

}

const readInput = async (message) => {
    const question = [{
        type: 'input',
        name: 'desc',
        message,
        validate(value){
            if (value.length===0){
                return 'Please insert  a value'
            }
            return true;
        }
    }]
    const {desc} =  await inquirer.prompt(question);
    return desc;
}

const listPlaces = async(places = []) => {
    const choices = places.map( (place,idx) => {
        const i =  `${idx + 1}`.green;
        return {
            value: place.id,
            name: `${i} ${place.name}`
        }
    });
    choices.unshift({
        value: '0',
        name: `0. `.green + `Cancel`
    })
    const questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Select place',
            choices
        }
    ]
    const {id} = await inquirer.prompt(questions);
    return id;
}

const confirm = async(message) => {
    const question = [{
        type: 'confirm',
        name: 'ok',
        message,
    }]
    const {ok} = await inquirer.prompt(question);
    return ok;
}

const listTasksChecklist = async(tasks = []) => {
    const choices = tasks.map( (task,idx) => {
        const i =  `${idx + 1}`.green;
        return {
            value: task.id,
            name: `${i} ${task.desc}`,
            checked: (task.completed ? true : false)
        }
    });
    
    const questions = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Select',
            choices
        }
    ]
    const {ids} = await inquirer.prompt(questions);
    return ids;
}

module.exports = {
    inquireMenu,
    pause,
    readInput,
    listPlaces,
    confirm,
    listTasksChecklist,
}