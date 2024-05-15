const urlParams = new URLSearchParams(window.location.search);
const dabloons = urlParams.get('dabloons');

function changePage(page){
    window.location.replace(page+`?dabloons=${dabloons}`);
}