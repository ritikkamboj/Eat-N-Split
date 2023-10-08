import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];

export default function App() {
  // const friends = initialFriends; take out here from friendlist component

  const [friends, setfriends] = useState(initialFriends);

  const [showAddFriend, setShowAddFriend] = useState(false);

  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddfriend() {
    // setShowAddFriend(!showAddFriend); this also working very fine
    setShowAddFriend((show) => !show);
  }

  function handleAddfriend(friend) {
    setfriends((friends) => [...friends, friend]); // we don't uses push here , beacuse it will mutate the original array, and reaact is all about immutability
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    // setSelectedFriend(friend);
    // yeh cur shayad selectedFriend variable ko point kar raha hai
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    // console.log(value);
    setfriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddfriend} />}

        {/* // applying condition on button accordingly  */}
        <Button onClick={handleShowAddfriend}>
          {showAddFriend ? 'close' : 'Add Friend'}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelection, selectedFriend }) {
  return (
    <ul className="list">
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = friend.id === selectedFriend?.id;
  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ₹{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ₹{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>All things are settle between you both </p>}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? 'Close' : 'select '}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48'); // this only will make the change of image when we reload , to stop this

  function handleSubmit(e) {
    // e.preventdef;
    e.preventDefault();

    if (!name || !image) return;
    const idCode = crypto.randomUUID();

    const newFriend = {
      name,
      image: `${image}?=${idCode}`, // nice point to be learned
      id: idCode,
      balance: 0,
    };

    // console.log(newFriend);
    onAddFriend(newFriend);

    setName('');
    setImage('');
  }

  return (
    <form className="form-add-friend" onSubmit={(e) => handleSubmit(e)}>
      <label>👫Friend's name</label>
      <input
        type="text"
        value={name}
        // placeholder="Type some etxt here "
        onChange={(e) => setName(e.target.value)}
      />

      <label>Image URL </label>
      <input
        type="url"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState('');
  const [paidByUser, setPaidByUser] = useState('');
  const paidByFriend = bill ? bill - paidByUser : '';
  const [whoisPaying, setWhoIsPaying] = useState('user');

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;

    onSplitBill(whoisPaying === 'user' ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={(e) => handleSubmit(e)}>
      <h2>Split a Bill with {selectedFriend.name} </h2>
      <label>Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      {/* // ruff work strucking on when we gets value gr                         eater than bill */}
      <label>Your's expenses</label>
      <input
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
        type="text"
      />
      <label> {selectedFriend.name} expenses</label>
      <input type="text" disabled value={paidByFriend} />
      <label>Who is paying the bill</label>
      <select
        value={whoisPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="you">you</option>
        <option value={selectedFriend.names}>{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
