function dirReduc(arr){
  // ...
  if (arr === []) {return null;}
  else {
    var newArray = arr;
    var checkForOpposites = true;
    while (checkForOpposites === true) {
      for (var i=1;i<arr.length;i++) {
        switch (arr[i]) {
          case 'NORTH':
            if (arr[i-1] === 'SOUTH') {
              newArray.splice(i-1,2);
              break;
            } else {
              break;
            }
          case 'SOUTH':
            if (arr[i-1] === 'NORTH') {
              newArray.splice(i-1,2);
              break;
            }
          case 'WEST':
            if (arr[i-1] === 'EAST') {
              newArray.splice(i-1,2);
              break;
            }
          case 'EAST':
            if (arr[i-1] === 'WEST') {
              newArray.splice(i-1,2);
              break;
            }
        }
      }
      for (var i=1;i<newArray.length;i++) {
        switch (newArray[i]) {
          case 'NORTH':
            if (newArray[i-1] === 'SOUTH') {
              checkForOpposites = true;
              break;
            }
          case 'SOUTH':
            if (newArray[i-1] === 'NORTH') {
              checkForOpposites = true;
              break;
            }
          case 'WEST':
            if (newArray[i-1] === 'EAST') {
              checkForOpposites = true;
              break;
            }
          case 'EAST':
            if (newArray[i-1] === 'WEST') {
              checkForOpposites = true;
              break;
            }
        }
      }
      arr = newArray;
    }
  }
}
