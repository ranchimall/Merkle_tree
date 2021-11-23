//check the constraints
let trlist;
let tree;
path=new Array();

    document.getElementById("trbtn").addEventListener('click',()=>{

    document.getElementById("otp").innerHTML="<br><span class='spinner'><sm-spinner></sm-spinner></span><br>";
   document.getElementById("waiting").innerHTML="<br>Please wait until the tree is constructed!!<br>Tree will be constructed within 5 minutes!!"
    let flag=0;
    let i=0;
  
    var minutesToAdd=60;
    currentDate=new Date();
    futureDate = new Date(currentDate.getTime() + minutesToAdd*1000);
    setTimeout(()=>{if(futureDate<=new Date()){ 
        merkletreepath()
    }},60000);

    let trid=document.getElementById("trid").value;
     trlist=trid.split(",");
    if(trlist.length>="6"){
        merkletreepath();

     } })


     function merkletreepath(){

        let trid=document.getElementById("trid").value;
        let trlist=trid.split(",");
        tree=new MerkleTree(trlist);
        tree.createTree();
        rootHash=tree.getRootHash();
        document.getElementById("waiting").innerHTML=" ";
        document.getElementById("otp").innerHTML="<br><b style='color:black'>Root : </b>";
        var id1=document.querySelector("#otp");
       var newdiv= document.createElement('sm-copy')
        newdiv.value=rootHash;
        id1.appendChild(newdiv);


              //path
    for(let i=0;i<trlist.length;i++){
        //let path[i] = tree.getHashPathToRoot(trlist[i]);
        path.push(tree.getHashPathToRoot(trlist[i]));
        }
        otp1.classList.add("scroll");

        for(let i=0;i<trlist.length;i++){

                var id1=document.querySelector("#otp1");
                var newdiv1= document.createElement('div')
                 newdiv1.innerHTML="<br><b style='color:black'>path["+trlist[i]+"] =</b> ";
                 id1.appendChild(newdiv1);

                var id1=document.querySelector("#otp1");
                var newdiv= document.createElement('sm-copy')
                 newdiv.value=path[i];
                 id1.appendChild(newdiv);
        }
       
        
         //writing into cloud
         options={receiverID:"FKAEdnPfjXLHSYwrXQu377ugN4tXU7VGdf",comment:"Storing roothash in cloud",application:"Tree_root"}
         floCloudAPI.sendApplicationData("Merkle_Tree",rootHash,options).then(
             function(value){
                 let val=value;
                 let arr=new Array();
                 arr=Object.entries(val);
                 document.getElementById('otp3').innerHTML="<b style='color:black'>Unique ID : ";
                 var id1=document.querySelector("#otp3");
                 var newdiv= document.createElement('sm-copy')
                  newdiv.value=arr[0][0];
                  id1.appendChild(newdiv);
                 
                 console.log("Written into Cloud");
                
                 },
             function(error){
                 console.log(error);
             })

        }
    //verify path

document.getElementById("vrbtn").addEventListener('click',()=>{
    document.getElementById('otp2').innerHTML='<sm-spinner class="spinner"></sm-spinner>'
    let roothash=document.getElementById("roothash1").value;
   floCloudAPI.requestApplicationData(roothash,{message:"Merkle_Tree",receiverID:"FKAEdnPfjXLHSYwrXQu377ugN4tXU7VGdf",application:"Tree_root"}).then(
       function(value){
        let unqid=document.getElementById('uniqid').value;
           let val=value;
           let res=0;
           let ab=Object.getOwnPropertyNames(val);
           if(ab.length==0){
               res=0;
           }
           for(i=0;i<ab.length;i++){
               if(ab[i]==unqid){
                  res=1;
               }
           }
           if(res==1){
            document.getElementById("otp2").innerHTML="<span class='otpver'><b style='color:black;'>The Root ' " +roothash+"  present in the cloud!!</span>";
            let veripath=document.getElementById('path11').value;
            let elem=document.getElementById('ele').value;
            let trlists=veripath.split(",");
            tree2=new MerkleTree(trlists);
            tree2.createTree();
            path2=tree2.verifyMerkleMembership(elem,roothash,trlists);

            if(path2==true){
            document.getElementById("otp4").innerHTML="<span class='otpver'><b style='color:black;'>The <b>PATH</b> exists for the Root</span>";
            }
            else{
            document.getElementById("otp4").innerHTML="<span class='otpver'><b style='color:black;'>The <b>PATH </b>does not exists for the Root</span>";

            }


        }else{
            document.getElementById("otp2").innerHTML="<span class='otpver'><b style='color:black;'>The Root ' " +roothash+" ' is not present in the cloud!!</span>";
        }
       },
       function(error){
           console.log(error)
       }
   )

  /* function getfrmcloud(){
    let i=0;
    let res=0;
     let unqid=document.getElementById('uniqid').value;
    let d=new Array();
    let y=new Array();
    let w={};
    w=floDapps.getNextGeneralData(roothash)
     d=(Object.getOwnPropertyNames(w));
   // y= Object.values(d);

 for(i=0;i<d.length;i++){
     if(d[i]==unqid){
         res=1;
     }else{
         res=0;
     }
 }

   }

   .then(
       function(value){
           q=floGlobals.generalData;
        w=new Array();
        w= Object.entries(q);
        console.log(w);
        let checker=roothash.concat("|FKAEdnPfjXLHSYwrXQu377ugN4tXU7VGdf|Tree_root")
        for(let i=0;i<w.length;i++){
            for(let j=0;j<w[i].length;j++){
            if(w[i][j]==checker){
                alert("Did it")
                console.log(w[i][j])
            }}
        }*/
     /*   let hash="|";
        let rid=hash.concat("FKAEdnPfjXLHSYwrXQu377ugN4tXU7VGdf");
        let ty=hash.concat("Tree_root");
        let checker=roothash.concat(rid,ty);
        for(let i=0;i<q.length;i++){
        if(Object.getOwnPropertyNames(value)==checker){
            console.log(checker);
            console.log("Available")
        }
        else{
            console.log(checker);
            console.log("Not Available")
        }

    }*/
       }/*,
       function(error){
       console.log(error)
       }
   )
}*/)

/*document.getElementById("vrbtn").addEventListener('click',()=>{
    let roothash=document.getElementById("roothash1").value;
    floCloudAPI.requestGeneralData(roothash,{message:"Merkle_Tree",receiverID:"FKAEdnPfjXLHSYwrXQu377ugN4tXU7VGdf",application:"Tree_root"}).then(
        function (value){
             let hash="|";
             let rid=hash.concat("FKAEdnPfjXLHSYwrXQu377ugN4tXU7VGdf");
            // alert(rid);
             let ty=hash.concat("Tree_root");
            // alert(ty);
             let checker=roothash.concat(rid,ty);
            // alert(checker);
            let q=floGlobals.generalData;
            console.log(checker);
                if(Object.getOwnPropertyNames(q).includes(checker)){
                    alert("This is the index : "+Object.getOwnPropertyNames(q).indexOf(checker))
                    pathchecker()
                    console.log("Available");
                }
                else{
                    document.getElementById("otp2").innerHTML="<span class='otpver'><b style='color:black;'>The Root ' " +roothash+" is not present in the cloud!!</span>";
                    console.log("Not available");
                }
            
            },
            function(error)
        {
          console.log(error);
        }
    
    );

        //To check the path can be constructed using the roothash
        function pathchecker(){
    let ele=document.getElementById("ele").value;
    tree=new MerkleTree(trlist);
    path_string=document.getElementById("path11").value;
    path1=path_string.split(',')
    let verification=tree.verifyMerkleMembership(ele,roothash,path1);
    if(verification==true){
        document.getElementById("otp2").innerHTML="<span class='otpver'><b style='color:black;'>TRUE!, '"+ele+"' is PRESENT in</b>' "+roothash+" ' !</span>";
    }
    else{
        document.getElementById("otp2").innerHTML="<span class='otpver'><b style='color:black;'>FALSE!, ' "+ele+" ' is NOT PRESENT in</b> ' "+roothash+" ' !</span>";

    }}
})*/




/* 
p=floDapps.getNextGeneralData("b7ad912a7ab69b1330110f374079630e0b89c3c4b360ed741640126a9833614f")
p["1631861808914_FLRWYmzuew3Xr9cayG94PzgDD9WSBJvqde"]
p[9]
r=Object.getOwnPropertyNames(p)
r[0]
*/
/*
                To check the presence of the roothash
Object.getOwnPropertyNames(q["b7da912a7ab69b1330110f374079630e0b89c3c4b360ed741640126a9833614f|FKAEdnPfjXLHSYwrXQu377ugN4tXU7VGdf|Tree_root"])
*/

/*if(Object.getOwnPropertyNames(q["Merkle_Tree|FKAEdnPfjXLHSYwrXQu377ugN4tXU7VGdf|TEST_MODE"])!=null){alert(q["Merkle_Tree|FKAEdnPfjXLHSYwrXQu377ugN4tXU7VGdf|TEST_MODE"])}
undefined
if(Object.getOwnPropertyNames(q["Merkle_Tree|FKAEdnPfjXLHSYwrXQu377ugN4tXU7VGdf|TEST_MODE"])!=null){console.log(q["Merkle_Tree|FKAEdnPfjXLHSYwrXQu377ugN4tXU7VGdf|TEST_MODE"])}

FLO Dapps

p=floDapps.getNextGeneralData("b7ad912a7ab69b1330110f374079630e0b89c3c4b360ed741640126a9833614f")
{}
Object.getOwnPropertyNames(p)
[]length: 0[[Prototype]]: Array(0)
floDapps.getNextGeneralData("b7ad912a7ab69b1330110f374079630e0b89c3c4b360ed741640126a9833614f").hasOwnProperty("b7ad912a7ab69b1330110f374079630e0b89c3c4b360ed741640126a9833614f")
false
floDapps.getNextGeneralData().hasOwnProperty("b7ad912a7ab69b1330110f374079630e0b89c3c4b360ed741640126a9833614f")
*/