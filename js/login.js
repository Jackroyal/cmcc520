    document.body.style.backgroundColor="red";
    alert(1123);
    if(document.head.getElementsByTagName('script').length==1){
        document.getElementById('loginForm').submit();

    }
    else{
        document.head.removeChild(document.head.getElementsByTagName('script')[0]);
        alert('gogo');
    }
    alert(000999999999999999);
