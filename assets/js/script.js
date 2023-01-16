const menu = document.querySelector('.top')
const show_compras = menu.querySelector(".compras");
const show_pagamentos = menu.querySelector(".pagamentos");
const show_saldos = menu.querySelector(".saldos");

const tabela = document.querySelector(".table");
const cabecalho_tabela = tabela.querySelector(".head_table");
const corpo_tabela = tabela.querySelector(".body_table");

const vazio = document.querySelector('.vazio')

const box_compra = document.querySelector('.box_compra');
const valor_total = box_compra.querySelector('.valor_total');
const close_box_compra = box_compra.querySelector('.close');
const cancel_box_compra = box_compra.querySelector('.cancelar');

const box_pagamento = document.querySelector('.box_pagamento');
const valor_total_pagamento = box_pagamento.querySelector('.valor_total');
const close_box_pagamento = box_pagamento.querySelector('.close');
const cancel_box_pagamento = box_pagamento.querySelector('.cancelar');

const show_box_compra = document.querySelector('.show_box_compra');
const box_grafico = document.querySelector(".box_grafico")

let id_compra = undefined, id_pagamento = undefined;

let alterar_titulo = texto => document.querySelector(".titulo").textContent = texto;
let alterar_tabela = (array, num_col) => {
    cabecalho_tabela.innerHTML = '';
    corpo_tabela.innerHTML = '';
    for (const iterator of array) {
        cabecalho_tabela.innerHTML += `<a>${iterator}</a>`;
    }
    for (const iterator of menu.querySelectorAll('div')) {
        iterator.classList.remove('ativo')
    }
    document.documentElement.style.setProperty('--col',num_col);
}

let pagamentos = [], compras = [];

let Listar_compras = ()=>{
    if(!!JSON.parse(localStorage.getItem("Compras")) && JSON.parse(localStorage.getItem("Compras")).length) {
        compras = JSON.parse(localStorage.getItem("Compras"));
        for (const compra of compras) {
            corpo_tabela.innerHTML +=   `
                                        <div>
                                            <a>${dateTimeToUTC(compra.data,2)}</a>
                                            <a>${compra.loja}</a>
                                            <a>${compra.qtd_parcelas}</a>
                                            <a>${(compra.valor).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</a>
                                            <a>${(compra.valor*compra.qtd_parcelas).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</a>
                                            <a>
                                                ${compra.parcelas_restantes > 0 ? `<span class="material-symbols-sharp pagar" onclick="Show_box_pagamento(${compra.id})">payments</span>` : ''}
                                                <span class="material-symbols-sharp editar" onclick="Show_box_compra(${compra.id})">edit_square</span>
                                                <span class="material-symbols-sharp deletar" onclick="Deletar_compra(${compra.id})">delete</span>
                                            </a>
                                        </div>
                                    `
        }
        vazio.classList.add('hidden');
        tabela.classList.remove('hidden');
        box_grafico.classList.remove('hidden');
    }else{
        tabela.classList.add('hidden');
        vazio.querySelector('h1').innerText = 'Nenhuma compra encontrada';
        vazio.classList.remove('hidden');
        box_grafico.classList.add('hidden');
    }
    legenda_grafico.value == 1 ? Pegar_valores_loja() : Pegar_valores_mes()
}

show_compras.addEventListener("click",()=>{
    alterar_titulo("COMPRAS");
    alterar_tabela(["DATA","LOJA","PARCELAS","VALOR PARCELA","VALOR TOTAL","AÇÕES"],6);
    show_compras.classList.add('ativo');
    Listar_compras();
});

let Listar_pagamentos = () => {
    alterar_titulo("PAGAMENTOS");
    alterar_tabela(["DATA","LOJA","PARCELA","VALOR","AÇÕES"],5);
    show_pagamentos.classList.add('ativo');
    if(!!JSON.parse(localStorage.getItem("Pagamentos")) && JSON.parse(localStorage.getItem("Pagamentos")).length) {
        pagamentos = JSON.parse(localStorage.getItem("Pagamentos"));
        for (const pagamento of pagamentos) {
            corpo_tabela.innerHTML +=   `
                                        <div>
                                            <a>${dateTimeToUTC(pagamento.data,2)}</a>
                                            <a>${pagamento.loja}</a>
                                            <a>${pagamento.parcelas}</a>
                                            <a>${pagamento.valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</a>
                                            <a>
                                                <span class="material-symbols-sharp editar" onclick="Show_box_pagamento(${pagamento.id_compra},${pagamento.id})">edit_square</span>
                                                <span class="material-symbols-sharp deletar" onclick="Deletar_pagamento(${pagamento.id_compra},${pagamento.id})">delete</span>
                                            </a>
                                        </div>
                                    `
        }
        vazio.classList.add('hidden');
        tabela.classList.remove('hidden');
    }else{
        tabela.classList.add('hidden');
        vazio.querySelector('h1').innerText = 'Nenhum pagamento encontrado';
        vazio.classList.remove('hidden');
    }
}

show_pagamentos.addEventListener("click",()=>{Listar_pagamentos()});

show_saldos.addEventListener("click",()=>{
    alterar_titulo("SALDOS");
    alterar_tabela(["LOJA","PARCELAS","VALOR PARCELA","VALOR TOTAL"],4);
    show_saldos.classList.add('ativo');

    if(!!JSON.parse(localStorage.getItem("Compras")) && JSON.parse(localStorage.getItem("Compras")).length){
        compras = JSON.parse(localStorage.getItem("Compras"));
        if(!!JSON.parse(localStorage.getItem("Pagamentos"))) pagamentos = JSON.parse(localStorage.getItem("Pagamentos"));
        for (const compra of compras) {
            corpo_tabela.innerHTML +=   `
                                            <div>
                                                <a>${compra.loja}</a>
                                                <a>${compra.parcelas_restantes}</a>
                                                <a>${(compra.valor).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</a>
                                                <a>${(compra.valor*compra.parcelas_restantes).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</a>
                                            </div>
                                        `
        }
        vazio.classList.add('hidden');
        tabela.classList.remove('hidden');
    }else{
        tabela.classList.add('hidden');
        vazio.querySelector('h1').innerText = 'Nenhuma compra encontrada';
        vazio.classList.remove('hidden');
    }
});

let preencher_box_compra = (id) =>{
    let compra = compras.find(compra => id == compra.id)
    box_compra.querySelector('#nome_loja').value = compra.loja;
    box_compra.querySelector('#data_compra').value = compra.data;
    box_compra.querySelector('#qtd_parcela').value = compra.qtd_parcelas;
    box_compra.querySelector('#valor_parcela').value = compra.valor;
    alterar_valor();
    box_compra.querySelector('#obs_compra').value = compra.obs_compra;
}

let validar_dados_inputs = (element, erro) => {
    if(element.value.length <= 0){
        element.classList.add('error')
        return true
    }
    element.classList.remove('error')
    return erro
}

let validar_dados = () =>{
    erro = false;
    erro = validar_dados_inputs(box_compra.querySelector('#nome_loja'), erro);
    erro = validar_dados_inputs(box_compra.querySelector('#data_compra'), erro);
    erro = validar_dados_inputs(box_compra.querySelector('#qtd_parcela'), erro);
    erro = validar_dados_inputs(box_compra.querySelector('#valor_parcela'), erro);
    return erro;
}

let verificar_pagamento = id =>{
    let compra = compras.find(compra => id == compra.id)
    return compra.qtd_parcelas > compra.parcelas_restantes ? false : true
}

let Show_box_compra = (id) => {
    id_compra = id;
    if(!!id){
        if(verificar_pagamento(id)){
            preencher_box_compra(id);
            box_compra.querySelector('.adicionar').innerText = "Editar"
            box_compra.parentElement.classList.remove('hidden');
        }else{
            showMessageBox().showMessage({
                type: 'danger',
                title: 'Editar Compra',
                text: `Está compra não pode ser editada por já ter pagamentos efetivados!`
            })
        }
    }else{
        box_compra.querySelector('.adicionar').innerText = "Adicionar"
        box_compra.parentElement.classList.remove('hidden');
    }
}

let Hide_box_compra = () => {
    id_compra = undefined;
    for (const input of box_compra.querySelectorAll('input')) {
        input.value = '';
        input.classList.remove('error');
    }
    box_compra.querySelector('textarea').value = '';
    box_compra.querySelector('textarea').classList.remove('error');
    valor_total.innerText = "R$ 0,00";
    box_compra.parentElement.classList.add('hidden');
}

show_box_compra.addEventListener('click',()=>Show_box_compra());
cancel_box_compra.addEventListener('click',Hide_box_compra);
close_box_compra.addEventListener('click',Hide_box_compra);

box_compra.addEventListener('submit',(event)=>{
    event.preventDefault();
    if(!!id_compra){
        if(!validar_dados()){
            showMessageBox().showMessage({
                type: 'warning',
                title: 'Editar Compra',
                text: `Realmente deseja <strong>editar</strong> está compra?`,
                accept:{
                    function : ()=>{
                        let new_compras = compras.map(compra=>{
                            if(id_compra == compra.id){
                                return {
                                    id: compra.id,
                                    loja: box_compra.querySelector('#nome_loja').value,
                                    valor: parseFloat(box_compra.querySelector('#valor_parcela').value),
                                    qtd_parcelas: parseInt(box_compra.querySelector('#qtd_parcela').value),
                                    data: box_compra.querySelector('#data_compra').value,
                                    obs_compra: box_compra.querySelector('#obs_compra').value,
                                    parcelas_restantes: parseInt(box_compra.querySelector('#qtd_parcela').value)
                                }
                            }else{
                                return compra
                            }
                        })
                        localStorage.setItem('Compras',JSON.stringify(new_compras))
                        corpo_tabela.innerHTML = '';
                        Listar_compras();
                        Hide_box_compra();
                    },
                    text: 'Editar'
                }
            })
        }
    }else{
        if(!validar_dados()){
            showMessageBox().showMessage({
                type: 'warning',
                title: 'Adicionar Compra',
                text: `Realmente deseja <strong>adicionar</strong> está compra?`,
                accept:{
                    function : ()=>{
                        let new_id = !!compras ? compras.reduce((acc, {id})=> acumulador = Math.max(acc, id),0) : 0
                        
                        let dados = {
                            id: ++new_id,
                            loja: box_compra.querySelector('#nome_loja').value,
                            valor: parseFloat(box_compra.querySelector('#valor_parcela').value),
                            qtd_parcelas: parseInt(box_compra.querySelector('#qtd_parcela').value),
                            data: box_compra.querySelector('#data_compra').value,
                            obs_compra: box_compra.querySelector('#obs_compra').value,
                            parcelas_restantes: parseInt(box_compra.querySelector('#qtd_parcela').value)
                        }
                        compras.push(dados)
                        localStorage.setItem('Compras',JSON.stringify(compras))
                        corpo_tabela.innerHTML = '';
                        Listar_compras();
                        Hide_box_compra();
                    },
                    text: 'Adicionar'
                }
            })
        }
    }
})

let alterar_valor = () => {
    valor_total.innerText = (valor_parcela.value*qtd_parcela.value).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
}

qtd_parcela.addEventListener('change',alterar_valor)
valor_parcela.addEventListener('change',alterar_valor)

let preencher_box_pagamento = (id, id_pagamento = null) =>{
    let compra = compras.find(compra => id == compra.id)
    let pagamento = pagamentos.find(pagamento => id_pagamento == pagamento.id)
    let parcelas = !!id_pagamento ? +pagamento.parcelas + compra.parcelas_restantes : +compra.parcelas_restantes
    box_pagamento.querySelector('#nome_loja_pagamento').value = compra.loja
    for (let i = 1; i <= parcelas; i++) {
        box_pagamento.querySelector('#qtd_parcela_pagamento').innerHTML +=`<option value="${i}">${i}</option>`
    }
    if(!!id_pagamento) box_pagamento.querySelector('#data_pagamento').value = pagamento.data;
    box_pagamento.querySelector('#valor_parcela_pagamento').value = compra.valor;
    alterar_valor_pagamento();
}

let alterar_valor_pagamento = ()=>{
    valor_total_pagamento.innerText = (box_pagamento.querySelector('.valor_parcela_pagamento').value*box_pagamento.querySelector('#qtd_parcela_pagamento').value).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
}

box_pagamento.querySelector('#qtd_parcela_pagamento').addEventListener('change',alterar_valor_pagamento);

let Show_box_pagamento = (id, id_paga = null)=>{
    id_compra = id;
    preencher_box_pagamento(id, id_paga);
    if(!!id_paga){
        id_pagamento = id_paga;
        box_pagamento.querySelector('.pagar').innerText = "Editar"
    }else{
        box_pagamento.querySelector('.pagar').innerText = "Adicionar"
    }
    box_pagamento.parentElement.classList.remove('hidden');
}

let Hide_box_pagamento = ()=>{
    id_compra = undefined;
    id_pagamento = undefined;
    for (const input of box_pagamento.querySelectorAll('input')) {
        input.value = '';
        input.classList.remove('error');
    }
    box_pagamento.querySelector('textarea').value = '';
    box_pagamento.querySelector('select').innerHTML = '';
    box_pagamento.parentElement.classList.add('hidden');
}

let Deletar_compra = id =>{
    if(!!id){
        if(verificar_pagamento(id)){
            showMessageBox().showMessage({
                type: 'danger',
                title: 'Excluir Compra',
                text: `Realmente deseja excluir está compra?`,
                accept:{
                    function : ()=>{
                        compras = compras.filter((item) => item.id !== id)
                        localStorage.setItem('Compras',JSON.stringify(compras))
                        corpo_tabela.innerHTML = '';
                        Listar_compras();
                    },
                    text: 'Excluir'
                }
            })
        }else{
            showMessageBox().showMessage({
                type: 'danger',
                title: 'Excluir Compra',
                text: `Está compra não pode ser excluída por já ter pagamentos efetivados!`
            })
        }
    }else{
        showMessageBox().showMessage({
            type: 'danger',
            title: 'ERRO DESCONHECIDO',
            text: `ERRO DESCONHECIDO AO TENTAR EXCLUIR COMPRA!`
        })
    }
}



let Deletar_pagamento = (id, id_paga) =>{
    if(!!id && !!id_paga){
        showMessageBox().showMessage({
            type: 'danger',
            title: 'Excluir Compra',
            text: `Realmente deseja excluir este pagamento?`,
            accept:{
                function : ()=>{
                    
                    let parcelas_restantes = pagamentos.find(pagamento => id_paga == pagamento.id).parcelas
                        
                    let new_compras = compras.map(compra=>{
                        if(id == compra.id){
                            return {
                                id: compra.id,
                                loja: compra.loja,
                                valor: compra.valor,
                                qtd_parcelas: compra.qtd_parcelas,
                                data: compra.data,
                                obs_compra: compra.obs_compra,
                                parcelas_restantes: compra.parcelas_restantes + +parcelas_restantes
                            }
                        }else{
                            return compra
                        }
                    })
                    localStorage.setItem('Compras',JSON.stringify(new_compras));

                    pagamentos = pagamentos.filter((item) => item.id !== id_paga)
                    localStorage.setItem('Pagamentos',JSON.stringify(pagamentos))
                    corpo_tabela.innerHTML = '';
                    Listar_pagamentos();
                },
                text: 'Excluir'
            }
        })
    }else{
        showMessageBox().showMessage({
            type: 'danger',
            title: 'ERRO DESCONHECIDO',
            text: `ERRO DESCONHECIDO AO TENTAR EXCLUIR COMPRA!`
        })
    }
}

cancel_box_pagamento.addEventListener('click',Hide_box_pagamento);
close_box_pagamento.addEventListener('click',Hide_box_pagamento);

box_pagamento.addEventListener('submit',(event)=>{
    event.preventDefault();
    erro = false;
    erro = validar_dados_inputs(box_pagamento.querySelector('#data_pagamento'), erro);
    if(!erro){
        if(!!id_pagamento){
            showMessageBox().showMessage({
                type: 'warning',
                title: 'Editar pagamento',
                text: `Realmente deseja <strong>adicionar</strong> este pagamento?`,
                accept:{
                    function : ()=>{
                                        
                        let parcelas_restantes = pagamentos.find(pagamento => id_pagamento == pagamento.id).parcelas
                        
                        let new_compras = compras.map(compra=>{
                            if(id_compra == compra.id){
                                return {
                                    id: compra.id,
                                    loja: compra.loja,
                                    valor: compra.valor,
                                    qtd_parcelas: compra.qtd_parcelas,
                                    data: compra.data,
                                    obs_compra: compra.obs_compra,
                                    parcelas_restantes: compra.parcelas_restantes + +parcelas_restantes - +box_pagamento.querySelector('#qtd_parcela_pagamento').value
                                }
                            }else{
                                return compra
                            }
                        })
                        localStorage.setItem('Compras',JSON.stringify(new_compras));

                        
                        let new_pagamentos = pagamentos.map(pagamento=>{
                            if(id_pagamento == pagamento.id){
                                return {
                                    id: pagamento.id,
                                    loja: pagamento.loja,
                                    valor: pagamento.valor,
                                    parcelas: box_pagamento.querySelector('#qtd_parcela_pagamento').value,
                                    data: box_pagamento.querySelector('#data_pagamento').value,
                                    obs_pagamento: box_pagamento.querySelector('#obs_pagamento').value,
                                    id_compra: pagamento.id_compra
                                }
                            }else{
                                return pagamento
                            }
                        })
                        
                        localStorage.setItem('Pagamentos',JSON.stringify(new_pagamentos))
                        corpo_tabela.innerHTML = '';
                        Listar_pagamentos()
                        Hide_box_pagamento();
                    },
                    text: 'Editar'
                }
            })
        }else{
            
            showMessageBox().showMessage({
                type: 'warning',
                title: 'Adicionar pagamento',
                text: `Realmente deseja <strong>adicionar</strong> este pagamento?`,
                accept:{
                    
                    function : ()=>{
                        
                        let new_compras = compras.map(compra=>{
                            if(id_compra == compra.id){
                                return {
                                    id: compra.id,
                                    loja: compra.loja,
                                    valor: compra.valor,
                                    qtd_parcelas: compra.qtd_parcelas,
                                    data: compra.data,
                                    obs_compra: compra.obs_compra,
                                    parcelas_restantes: compra.parcelas_restantes + - +box_pagamento.querySelector('#qtd_parcela_pagamento').value
                                }
                            }else{
                                return compra
                            }
                        })
                        localStorage.setItem('Compras',JSON.stringify(new_compras));

                        let new_id = !!pagamentos ? pagamentos.reduce((acc, {id})=> acumulador = Math.max(acc, id),0) : 0
                            
                        let dados = {
                            id: ++new_id,
                            loja: box_pagamento.querySelector('#nome_loja_pagamento').value,
                            valor: parseFloat(box_pagamento.querySelector('#valor_parcela_pagamento').value),
                            parcelas: box_pagamento.querySelector('#qtd_parcela_pagamento').value,
                            data: box_pagamento.querySelector('#data_pagamento').value,
                            obs_pagamento: box_pagamento.querySelector('#obs_pagamento').value,
                            id_compra: id_compra
                        }
                        pagamentos.push(dados)
                        localStorage.setItem('Pagamentos',JSON.stringify(pagamentos));
                        corpo_tabela.innerHTML = '';
                        Listar_pagamentos()
                        Hide_box_pagamento();
                    },
                    text: 'Adicionar'
                }
            })
        }
    }
})

/* 
TESTE DE LEITURA DE ARQUIVO XLSX E CSV
GetHTML('/CSV.xlsx', 'get',obj => {
    if(obj.status === 200){
        let allRows = obj.responseText.split(/\r?\n|\r/);
        let tbl = document.createElement("table");
        let thead = document.createElement("thead");
        let tblBody = document.createElement("tbody");
    
        for (let singleRow = 0; singleRow < allRows.length; singleRow++) {
            let tr = document.createElement("tr");
            let rowCells = allRows[singleRow].split(',');
            for (let rowCell = 0; rowCell < rowCells.length; rowCell++) {
                if (singleRow === 0) {
                    let th = document.createElement("th");
                    th.innerText = rowCells[rowCell];
                    tr.appendChild(th);
                } else {
                    let td = document.createElement("td");
                    td.innerText = rowCells[rowCell];
                    tr.appendChild(td);
                }
            }
            singleRow === 0 ? thead.appendChild(tr) : tblBody.appendChild(tr)
        } 
        tbl.appendChild(thead);
        tbl.appendChild(tblBody);
        document.querySelector('body').append(tbl);
    }else{
        alert('erro')
    }
}) */

const grafico_despesa_mensal = document.getElementById("grafico_despesa_mensal");
let myChart = new Chart(grafico_despesa_mensal)

let Pegar_valores_loja =  () =>{
    const labels = [], values = []
    let graf = compras.reduce((soma, cur) => {
        let repetido = soma.find(elem => elem.loja === cur.loja) 
        if (repetido) repetido.valor += cur.valor*cur.qtd_parcelas; 
        else soma.push({'loja': cur.loja, 'valor': cur.valor*cur.qtd_parcelas});
        return soma;
    }, []);

    for (const compra of graf) {
        labels.push(compra.loja)
        values.push(compra.valor)
    }
    GerarGrafico(grafico_despesa_mensal,labels,'Total de compras por loja',values, 'bar')
}

let Pegar_valores_mes =  () =>{
    const labels = [], values = []
    let graf = compras.reduce((soma, cur) => {
        let repetido = soma.find(elem => new Date(elem.data).getMonth() === new Date(cur.data).getMonth()) 
        if (repetido) repetido.valor += cur.valor*cur.qtd_parcelas; 
        else soma.push({'data': cur.data, 'valor': cur.valor*cur.qtd_parcelas});
        return soma;
    }, []);

    function compare(a,b) {
        if (a.data < b.data)
            return -1;
        if (a.data > b.data)
            return 1;
        return 0;
    }

    graf.sort(compare)
    for (const compra of graf) {
        labels.push(new Date(compra.data).toLocaleString([], {month: 'long',year: 'numeric'}))
        values.push(compra.valor)
    }
    GerarGrafico(grafico_despesa_mensal,labels,'Total de compras por mês',values,'line')
}


let GerarGrafico = (local, labels, label, values, type) =>{
    myChart.destroy()
    myChart = new Chart(local, {
        type: type,
        data:{
            labels: labels,
            datasets: [{
                axis: 'y',
                label: label,
                data: values,
                borderWidth: 2,
                fill: false,
                tension: 0.1,
                backgroundColor: [
                  '#d42940'
                ]
              }]
        }
    })
}

const legenda_grafico = document.getElementById("legenda_grafico");
legenda_grafico.addEventListener('change',()=> legenda_grafico.value == 1 ? Pegar_valores_loja() : Pegar_valores_mes())


alterar_titulo("COMPRAS");
alterar_tabela(["DATA","LOJA","PARCELAS","VALOR PARCELA","VALOR TOTAL","AÇÕES"],6);
show_compras.classList.add('ativo');
Listar_compras();