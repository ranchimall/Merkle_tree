const addressZero = '0x0000000000000000000000000000000000000000000000000000000000000000'
const options = {
    hashLeaves: false,
    sortLeaves: true,
    sortPairs: true,
    duplicateOdd: false,
    isBitcoinTree: false
}
//check the constraints
getRef("trbtn").addEventListener('click', () => {
    getRef("waiting").innerHTML = `<sm-spinner class="margin-right-1"></sm-spinner> The tree is being constructed, please wait.`
    let trid = getRef("trid").value.trim();
    txIdList = trid.split(",");
    merkleTreePath();
})

let tree
function merkleTreePath() {
    let trid = getRef("trid").value.trim().split(",");
    let txIdList = trid.map(v => `0x${sha256(v.trim())}`);
    tree = new MerkleTree(txIdList, sha256, options)
    const merkleRoot = tree.getHexRoot()
    getRef("waiting").innerHTML = " ";
    getRef("otp").innerHTML = "<b>Root : </b>";
    let id1 = document.querySelector("#otp");
    let newDiv = document.createElement('sm-copy')
    newDiv.value = merkleRoot;
    id1.appendChild(newDiv);

    //path
    const otp1 = document.querySelector("#otp1");
    otp1.innerHTML = ''
    const frag = document.createDocumentFragment()
    txIdList.forEach((leaf, index) => {
        const div = document.createElement('div')
        const newDiv1 = document.createElement('div')
        newDiv1.innerHTML = `<b>Proof of "${trid[index]}":</b>`;
        const newDiv = document.createElement('sm-copy')
        newDiv.value = tree.getHexProof(leaf);
        div.append(newDiv1, newDiv)
        frag.append(div);
    })
    otp1.append(frag)

    // writing into cloud
    floCloudAPI.sendApplicationData('', merkleRoot).then((value) => {
        console.log(value)
    }).catch(err => {
        console.error(err)
    })
}

//verify path
getRef("vrbtn").addEventListener('click', () => {
    getRef("otp2").classList.remove('hide')
    getRef('otp2').innerHTML = '<sm-spinner class="spinner"></sm-spinner>'
    const merkleRoot = getRef("merkle_root").value.trim();
    const elementToCheck = getRef('element_to_check').value.trim();
    const proof = getRef('proof').value.trim().split(',')
    floCloudAPI.requestApplicationData(merkleRoot, { mostRecent: true }).then(res => {
        // let isInCloud = `<div>The Merkle root <b style="overflow-wrap: anywhere">${merkleRoot}</b> is ${res.length > 0 ? '' : 'not'} present in the cloud</div>`
        let verified
        const leaf = `0x${sha256(elementToCheck)}`
        verified = MerkleTree.verify(proof, leaf, merkleRoot, sha256, options)
        if (verified) {
            getRef("otp2").classList.remove('failed')
            getRef("otp2").classList.add('success')
        } else {
            getRef("otp2").classList.add('failed')
            getRef("otp2").classList.remove('success')
        }
        getRef("otp2").classList.remove('hide')
        getRef("otp2").innerHTML = ` <h4>${verified ? 'Verified' : 'Verification Failed (Not a member)'}</h4>`;
    }).catch(err => {
        notify(err, 'error')
    })
})