let price=[250,645,300,900,50];
console.log("price before discount is = ", price);
for (let i in price){
    price[i]=price[i]-(price[i]*0.10);
}
console.log("price after discount is = ", price);
price.push("Arrreyyyyyyyyyyyyyyyyyyyyy")
console.log(price);
price.unshift('hahahaha');
console.log(price);
let a=price.shift();
console.log(price);
console.log("Deleted elements is ", a, " thats a song; bitch");
price.slice(1,10); 
console.log(price);