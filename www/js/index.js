document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Dispositivo pronto!');
    carregarPizzas();

    const applista = document.getElementById('applista');
    const appcadastro = document.getElementById('appcadastro');

    const btnNovo = document.getElementById('btnNovo');
    const btnCancelar = document.getElementById('btnCancelar');

    btnNovo.addEventListener('click', () => {
        console.log("Botão Nova Pizza clicado!");
        applista.style.display = 'none';
        appcadastro.style.display = 'flex';
    });

    btnCancelar.addEventListener('click', () => {
        console.log("Botão Cancelar clicado!");
        applista.style.display = 'flex';
        appcadastro.style.display = 'none';
    });
}

function carregarPizzas() {
    console.log("Função carregarPizzas() chamada!");
}