import { useState } from "react"; 
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },  
];
function Button({children,onClick}){
  return <button className="button" onClick={onClick}>{ children}</button>
}

export default function  app(){
  const[friends,setFriends]=useState(initialFriends);
  const [showAddFreind,setShowAddFriend]=useState(true);
  const [selectedFriend,setSelectedFriend]=useState(null); 

function handleShowAddFriend(){
  setShowAddFriend((show)=>!show)
}

function handleAddFriend(friend){
  setFriends((friends)=>[...friends,friend]);
}

function handleSelection(friend){
  setSelectedFriend((curr)=>curr?.id ===friend.id  ? null : friend); //when we click on selected friend btn
                                                                    //  then friend become null
  setShowAddFriend(false);  
}

function handleSplitBill(value){
  setFriends((friends)=>friends.map((friend)=>
           friend.id===selectedFriend.id ? {...friend, balance :friend.balance+ value} : friend ))
          setSelectedFriend(null);
}
  return(
 <div className="app">
  <div className="sidebar">
     <FriendList friends={friends}
                 onSelection={handleSelection }   
                 selectedFriend={selectedFriend}
       />

    {showAddFreind && <FormAddFriend onAddFreind={handleAddFriend}/> }

    <Button onClick={handleShowAddFriend}>{showAddFreind ? "Close"  : "Add friend"}</Button>  </div>
    <div>

       {selectedFriend &&< FormSplitBill  selectedFriend={selectedFriend} onSplitBill={handleSplitBill}/> }
    </div>

 </div>
  )
}
function FriendList({friends,onSelection, selectedFriend}){
 
  return (
    <ul>
      {friends.map((friend)=>(
        <Friend friend={friend} onSelection={onSelection} selectedFriend={selectedFriend}/>
      ))}
    </ul>
  )
}
function Friend({friend, onSelection ,selectedFriend }){
  const isSelected=  selectedFriend?.id===friend.id;
  return (
    <li className={isSelected ? "Selected": ""}>
      <img src={friend.image} alt="clark image" />
      <h3>{friend.name}</h3>
      {friend.balance<0 && <p className="red">You Owe {friend.name} ${Math.abs(friend.balance)}</p>}
      {friend.balance>0 && <p className="green">{friend.name} owes you  ${Math.abs(friend.balance)}</p>}
      {friend.balance==0 && <p>You and  {friend.name} are even</p>}
      <Button onClick={()=> onSelection(friend)}>{ isSelected ? "Close ": "Select"}</Button>
      </li>
  )
}

function FormAddFriend({onAddFreind}){
  const [name,setName]=useState("");
  const [image,setImage]=useState("https://i.pravatar.cc/48");

function handleSubmit(e){
  e.preventDefault();
  const id=crypto.randomUUID(); 
  const newFriend={
      id,
      name,
      image,
      balance:0,
    
  };
  onAddFreind(newFriend);
  setName("");
  setImage("https://i.pravatar.cc/48");
}
  return <form className="form-add-friend" onSubmit={handleSubmit}>
    <lable> Friend name : </lable>
    <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />

    <label>  Image URL </label>  
    <input type="text" value={image} onChange={(e)=>setImage(e.target.value)} />
  
    <Button >Add</Button>
  </form>
}
function FormSplitBill({selectedFriend, onSplitBill}){
  const [bill,setBill]=useState("");
  const [paidByYou,setPaidByYou]=useState("");
  const [whoIsPay,setWhoIsPay]=useState("user");
 const friendBalance=bill ? bill-paidByYou : "";

 function handleSubmit(e){
    e.preventDefault();
    if(!bill || !paidByYou) return ;
    onSplitBill(whoIsPay ==="user"? friendBalance : -paidByYou);//if i pay then frnd balance on variable 
                                                              //if he pay then my -(balance) ex :bill=200 you(pay):50
                                                              //frnd:150 (on variable 150) ,if you :50 ,frnd(pay):150
                                                              // then (on variable -50(bcz your frnd owes 50 from you))
    
 }
  
  return(
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2> Split a bill with {selectedFriend.name}  &nbsp;  <img src={selectedFriend.image}/></h2>

    <b>Bill value :</b>
    <input  className="black" type="number" onChange={(e)=>setBill(Number(e.target.value))} />

     <b>Your exprense :</b>
    <input type="number"className="black" value={paidByYou} onChange={(e)=>setPaidByYou(Number(e.target.value) > bill ?  
                                                         paidByYou :  Number(e.target.value))} />

     <b>{selectedFriend.name}'s expense:</b>
    <input type="number" className="black" value={friendBalance} disabled />

      <b> Who is paying bill :</b>
      <select className="black" value={whoIsPay} onChange={(e)=>setWhoIsPay(Number(e.target.value)) } >

        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
    <Button >Split bill</Button>
    </form>
  )
}