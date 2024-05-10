const $ = document.querySelector.bind(document);

$('#darkBtn').addEventListener("click", dark);

function dark() {
    if ($(':root').hasAttribute('dark')) {
        $(':root').removeAttribute('dark');
        localStorage.setItem('mode', 'light');
        $('#darkBtn').textContent = '🌒';
    } else {
        $(':root').setAttribute('dark', '');
        localStorage.setItem('mode', 'dark');
        $('#darkBtn').textContent = '💡';
    }
}

function main() {
    if (localStorage.getItem('mode') === 'dark') {
        $(':root').setAttribute('dark', '');
    }
}

main()
