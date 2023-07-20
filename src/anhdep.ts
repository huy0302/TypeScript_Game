let hoten = localStorage.getItem("hoten") as string;
if (hoten == null) document.location = 'login.html';
document.getElementById("hoten").innerHTML = hoten;

type hinhdep={id:number; ten:string; url:string; mota:string; level:number;}
type nguoichoi={id:number; ten:string; diem:number; thoidiem:number;}

var arr_hinh:hinhdep[];
var urlhinh1:string=null;
var urlhinh2:string=null;
var diem=0;
const divHinhDep = document.getElementById('divhinhdep');
const divNguoiChoi = document.getElementById('divnguoichoi');
var diemthang=6;
var diemthua=-5;

////////////////////////
fetch("http://localhost:4000/hinh")
.then(res=>res.json())
.then(data=>{
  //xử lý ban đầu
  arr_hinh=data as hinhdep[];
  //thêm mảng
  arr_hinh=arr_hinh.concat(arr_hinh).concat(arr_hinh);
  //xáo trộn mảng
  arr_hinh=arr_hinh.sort((a,b)=>0.5 - Math.random());
  console.log(arr_hinh);
  return arr_hinh;
})
.then (arr_hinh=>{
  //hiện hình trong các div
  arr_hinh.forEach(h=>{
    divHinhDep.innerHTML+=`
    <div class="hinh">
      <img src='/public/images/${h.url}' title='${h.mota}'>
    </div>  
      `;
  });
  return arr_hinh;
})
.then (function(arr_hinh){
  //ẩn các hình trong div
  const arrdivHinh = document.querySelectorAll('div.hinh');
  arrdivHinh.forEach ((div:HTMLElement)=>div.children.item(0).className='an')
  //gắn click vào các div để ẩn hiện hình
  arrdivHinh.forEach((div:HTMLAreaElement)=>{
    let img=div.children.item(0);
    div.onclick = function(){nhapVaoDiv(div);}
  })
});

let nhapVaoDiv = (div:HTMLElement) => {
  let img =div.children.item(0);
  img.className=(img.className=='an')? 'hien':'an';
  if(urlhinh1==null) urlhinh1 = img.getAttribute("src") as string;
  else urlhinh2 = img.getAttribute("src") as string;
  if (urlhinh1 ==null && urlhinh2 ==null) return;
  if(urlhinh1!=null && urlhinh2!=null){//chọn 2 hình giông nhau
            if (urlhinh1 == urlhinh2){
                diem+=3;
            }
            else diem-=1;
            urlhinh1=null;
            urlhinh2=null;
            document.getElementById("diem").innerHTML=`<b>Số điểm hiện tại:${String(diem)}</b>`;
        }
  if(diem<diemthua){
    luudiem(hoten, diem);
    alert('Bạn đã thua');
  }
  if(diem>diemthang){
    luudiem(hoten, diem);
    alert('Bạn đã thắng')
  }
  //hien diem
document.getElementById("diem").innerHTML=`<b>Số điểm hiện tại:${String(diem)}</b>`;
}

let luudiem = (hoten:string, diem:number) =>{
  fetch(
    "http://localhost:4000/choi",
  {
    method:'post',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ten:hoten, diem:diem, thoidiem:new Date()})
  }
  )
 }
let hiennguoichoi= ()=>{
  fetch("http://localhost:4000/choi?_sort=diem&_order=desc")
  .then(res=> res.json())
  .then(data=>{
    let listnguoichoi:nguoichoi[]=data as nguoichoi[];
    divNguoiChoi.innerHTML=`<h3> Danh sách người chơi</h3>`;
    listnguoichoi.forEach ((nc, index)=>{
      divNguoiChoi.innerHTML+=`
      <p><span>${index + 1}.</span>
      <span>Tên:${nc.ten}.</span>
      <span>Điểm:${nc.diem}.</span>
      </p>`
    })
  })
}
hiennguoichoi();