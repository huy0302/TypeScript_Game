let hoten = localStorage.getItem("hoten");
if (hoten == null)
    document.location = 'login.html';
document.getElementById("hoten").innerHTML = hoten;
var arr_hinh;
var urlhinh1 = null;
var urlhinh2 = null;
var diem = 0;
const divHinhDep = document.getElementById('divhinhdep');
const divNguoiChoi = document.getElementById('divnguoichoi');
var diemthang = 6;
var diemthua = -5;

fetch("http://localhost:4000/hinh")
    .then(res => res.json())
    .then(data => {
    arr_hinh = data;
    arr_hinh = arr_hinh.concat(arr_hinh).concat(arr_hinh);
    arr_hinh = arr_hinh.sort((a, b) => 0.5 - Math.random());
    console.log(arr_hinh);
    return arr_hinh;
})
    .then(arr_hinh => {
    arr_hinh.forEach(h => {
        divHinhDep.innerHTML += `
    <div class="hinh">
      <img src='/public/images/${h.url}' title='${h.mota}'>
    </div>  
      `;
    });
    return arr_hinh;
})

    .then(function (arr_hinh) {
    const arrdivHinh = document.querySelectorAll('div.hinh');
    arrdivHinh.forEach((div) => div.children.item(0).className = 'an');
    arrdivHinh.forEach((div) => {
        let img = div.children.item(0);
        div.onclick = function () { nhapVaoDiv(div); };
    });
});
let nhapVaoDiv = (div) => {
    let img = div.children.item(0);
    img.className = (img.className == 'an') ? 'hien' : 'an';
    if (urlhinh1 == null)
        urlhinh1 = img.getAttribute("src");
    else
        urlhinh2 = img.getAttribute("src");
    if (urlhinh1 == null && urlhinh2 == null)
        return;
    if (urlhinh1 != null && urlhinh2 != null) {
        if (urlhinh1 == urlhinh2) {
            diem += 3;
        }
        else
            diem -= 1;
        urlhinh1 = null;
        urlhinh2 = null;
        
    }
    if (diem < diemthua) {
        luudiem(hoten, diem);
        alert('Bạn đã thua');
    }
    if (diem > diemthang) {
        luudiem(hoten, diem);
        alert('Bạn đã thắng');
    }
    document.getElementById("diem").innerHTML = `<b>Số điểm hiện tại:${String(diem)}</b>`;
};
let luudiem = (hoten, diem) => {
    fetch("http://localhost:4000/choi", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ten: hoten, diem: diem, thoidiem: new Date() })
    });
};
let hiennguoichoi = () => {
    fetch("http://localhost:4000/choi?_sort=diem&_order=desc")
        .then(res => res.json())
        .then(data => {
        let listnguoichoi = data;
        divNguoiChoi.innerHTML = `<h2> Danh sách người chơi</h2>`;
        listnguoichoi.forEach((nc, index) => {
            divNguoiChoi.innerHTML += `
            
      <p><span>${index + 1}.</span>
      <span>Tên:${nc.ten}</span>
      <span>Điểm:${nc.diem}</span>
      </p>`;
        });
    });
};

hiennguoichoi();
document.getElementById("diem").innerHTML = `<b>Số điểm hiện tại:${String(diem)}</b>`;