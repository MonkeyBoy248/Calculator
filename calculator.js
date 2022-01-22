const save_button = document.querySelector('#save'),
    budget_input = document.querySelector('input[type=text]'),
    form = document.querySelector('.start_summ'),
    wrapper = document.getElementById('wrapper'),
    left_budget = document.querySelector('.left'),
    change_button = document.getElementById('change'),
    new_operation_button = document.querySelector('#operations'), 
    pop_up = document.querySelector('.pop_up_form'),
    intro = document.querySelector('#intro'),
    operation_wrapper = document.querySelector('.operation_wrapper');
   
budget_input.addEventListener('input', () =>{
    if(wrapper.querySelector('.err')){
    wrapper.querySelector('.err').remove()
    }
    InputCheck(budget_input.value);
});

save_button.addEventListener('click', () =>{
    let budget_info = budget_input.value;
    if(budget_input.value == ""){
        budget_info = JSON.stringify(0);    
    }
    UpdateLS(budget_info);
    ChangeForm('sum');
});

function InputCheck(string){
    if(((/[a-zA-Zа-яА-Я]/).test(string))&&(string != ""))
     {
        let error_msg = document.createElement('span');
        error_msg.className = 'err';
        error_msg.innerHTML = 'Разрешены только цифры. Пожалуйста повторите ввод.';
        budget_input.after(error_msg);
        save_button.setAttribute('disabled', 'true');
    }else{
        save_button.removeAttribute('disabled');
    }
   
};

function ChangeForm(key) {
    let budget = JSON.parse(localStorage.getItem('sum'));
    if(budget === ""){
        budget = '0';
    }
    let left_display = left_budget.querySelector('span');
    left_display.innerHTML = `${budget} ₽`
    form.classList.add('hide');
    left_budget.classList.remove('hide');
};


if(localStorage.length != 0){
    ChangeForm('sum');
};


change_button.addEventListener('click', (e) => {
    budget_input.value = '';
    left_budget.classList.add('hide');
    form.classList.remove('hide');
    operation_wrapper.innerHTML = '';
    operations = [];
    UpdateOperations();

});

new_operation_button.addEventListener('click', () =>{
    pop_up.style.display = 'flex';
    if(operation_wrapper.children.length != 0){
        for(let i of operation_wrapper.children){
            i.style.opacity = '0';
        };
    }
    
});

let close_pop_up_button = document.querySelector('#close');

close_pop_up_button.addEventListener('click', () =>{
    pop_up.style.display = 'none';
    for(let i of operation_wrapper.children){
        i.style.opacity = '1';
    }
});

let add_operation_value = document.querySelector('#operation_value');
let add_operation_description = document.querySelector('#operation_description');
let add_operation_category = document.querySelector('#operation_category');

let operations;
!localStorage.operations ? operations = [] : operations = JSON.parse(localStorage.getItem('operations'));

class Operation {
    constructor(value, description, category, date) {
        this.value = value;
        this.description = description;
        this.category = category;
        this.date = date;
    }
};

function UpdateOperations(){
    localStorage.setItem('operations', JSON.stringify(operations));
};

function UpdateLS(value){
    localStorage.setItem('sum', JSON.stringify(value));
};

function Pad(n) {
    if (n < 10)
        return "0" + n;
    return n;
};

function GetDate(){
    let month=new Array(12);
    month[0]="Января";
    month[1]="Февраля";
    month[2]="Марта";
    month[3]="Апреля";
    month[4]="Мая";
    month[5]="Июня";
    month[6]="Июля";
    month[7]="Августа";
    month[8]="Сентября";
    month[9]="Октября";
    month[10]="Ноября";
    month[11]="Декабря";
    let weekday=new Array(7);
    weekday[0]="Вс";
    weekday[1]="Пн";
    weekday[2]="Вт";
    weekday[3]="Ср";
    weekday[4]="Чт";
    weekday[5]="Пт";
    weekday[6]="Сб";
    let date = new Date();
    return Pad(date.getDate()) + " " + month[date.getMonth()] + ", " + weekday[date.getDay()] + " " + Pad(date.getHours()) + ":" + Pad(date.getMinutes()) + ":" + Pad(date.getSeconds());
};

function CreateTemplate(elem, index) {
    let operation_template = document.createElement('div');
    operation_template.className = 'operation_template';
    operation_template.innerHTML = `
    <div id="info">
        <span id="current_date">${elem.date}</span>
        <span id="category">${elem.category}</span>
        <span id="description">${elem.description}</span>
        <span id="value">${elem.value} ₽</span>
    </div>
    <span class="delete"></span>`;
        return operation_template;
}


function FillTemplate() {
    operation_wrapper.innerHTML ="";
    if(operations.length > 0){
        operations.reverse().forEach((item, index) => {
            operation_wrapper.insertAdjacentElement("beforeend", CreateTemplate(item, index));
        });
    }
    
};

function UpdateData(value){
    UpdateOperations();
    UpdateLS(value);
    ChangeForm('sum');
}

let save_operation = document.querySelector('#save_operation');

FillTemplate();
SetOperationColor(operation_wrapper.children);

save_operation.addEventListener('click', ()=>{
    let budget = JSON.parse(localStorage.getItem('sum'));
    operations.push(new Operation(add_operation_value.value, add_operation_description.value, add_operation_category.value, GetDate()));
    budget = Number(budget) + Number(add_operation_value.value);
    UpdateData(budget);
    FillTemplate();
    SetOperationColor(operation_wrapper.children);
    pop_up.style.display = 'none';
    add_operation_value.value = '';
    add_operation_description.value = '';
});

function SetOperationColor(array){
    
    for(let i=0; i<array.length; i++){
        if(Number(operations[i].value) > 0){
            document.querySelectorAll('#value')[i].style.color = "green";
        }else{
            document.querySelectorAll('#value')[i].style.color = "red";
        }
    }
};

operation_wrapper.addEventListener('click', (e) =>{
        let target = e.target;
        let delete_btn_array = document.getElementsByClassName('delete');
        let targetOperationTemplate = operation_wrapper.children;
        let targetButtonIndex = [...delete_btn_array].indexOf(target);
        if(target.matches(".delete")){
            console.log(targetButtonIndex);
            console.log(operations[targetButtonIndex]);
            let left_after_delete = localStorage.getItem('sum');
            left_after_delete = Number(left_after_delete) - Number(operations[targetButtonIndex].value)
            targetOperationTemplate[targetButtonIndex].style.transform = 'translateX(-1100px)';
            targetOperationTemplate[targetButtonIndex].style.transition = ' transform 0.5s ease-in-out';
            setTimeout(() => {targetOperationTemplate[targetButtonIndex].remove()}, 500);
            console.log(operations);
            operations.splice(targetButtonIndex, 1);
            UpdateOperations();
            UpdateLS(left_after_delete);
            ChangeForm('sum');
            }
});
   
console.log(operations);

