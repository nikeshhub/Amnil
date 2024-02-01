//1. Reverse a string without using inbuilt reverse method
// let reverseString = (input) => {
//   let reversedString = "";

//   let inputArr = input.split("");

//   inputArr.forEach((value) => {
//     reversedString = value + reversedString;
//   });
//   return reversedString;
// };
// let output = reverseString("nikesh");
// console.log(output);

//2. Factorial calculation

// let factorialcalculate = (input) => {
//   if (input > 0) {
//     return input * factorialcalculate(input - 1);
//   } else if (input === 0) {
//     return 1;
//   } else if (!Number.isInteger(input)) {
//     return "Input must be number";
//   } else if (input < 0) {
//     return "Input should not be negative";
//   }
// };

// let output = factorialcalculate(10);
// console.log(output);

//3. Palindrome checker

// let checkPalindrome = (input) => {
//   let inputArr = input.split("");
//   let reverseArr = inputArr.reverse();
//   let reverseStr = reverseArr.join("");
//   if (reverseStr === input) {
//     return "The given string is palindrome";
//   } else {
//     return "The given string is not palindrome";
//   }
// };
// let output = checkPalindrome("tat");
// console.log(output);

//4. longest word

// let longestWord = (input) => {
//   let inputArr = input.split(" ");
//   let longestWord = "";
//   let longestWordLength = 0;
//   inputArr.forEach((value) => {
//     if (value.length > longestWordLength) {
//       longestWord = value;
//       longestWordLength = value.length;
//     }
//   });
//   return longestWord;
// };

// let output = longestWord("I am a man");
// console.log(output);

//5. FizzBuzz

// let fizzBuzz = () => {
//   for (let i = 1; i <= 100; i++) {
//     if (i % 3 == 0 && i % 5 == 0) {
//       console.log("FizzBuzz");
//     } else if (i % 3 == 0) {
//       console.log("Fizz");
//     } else if (i % 5 == 0) {
//       console.log("Buzz");
//     }
//   }
// };
// fizzBuzz();

//6. calculate sum of array elements

// let sum = (input) => {
//   let sum = input.reduce((acc, current) => {
//     return acc + current;
//   }, 0);
//   return sum;
// };
// let output = sum([1, 2, 3, 5]);
// console.log(output);

//7. title case a sentence

// const titleCase = (input) => {
//   const inputArr = input.split(" ");
//   const inputTitle = inputArr.map((value) => {
//     return value.charAt(0).toUpperCase() + value.slice(1);
//   });
//   const result = inputTitle.join(" ");
//   return result;
// };
// const output = titleCase("i am nikesh sapkota");
// console.log(output);

//8 count vowel
// let countVowel = (input) => {
//   let inputLower = input.toLowerCase();
//   let inputArr = inputLower.split("");
//   let vowels = ["a", "e", "i", "o", "u"];
//   let findVowel = inputArr.filter((value) => {
//     if (vowels.includes(value)) {
//       return value;
//     }
//   });

//   return findVowel.length;
// };
// let output = countVowel("kdsfhksdfheeeeejsUdf");
// console.log(output);

//9. Fibonacci Sequence

// let generatefibonacciSequence = (n) => {
//   let fibonacciSequence = [0, 1];

//   for (let i = 2; i < n; i++) {
//     let newNumber = fibonacciSequence[i - 1] + fibonacciSequence[i - 2];
//     fibonacciSequence.push(newNumber);
//   }
//   return fibonacciSequence;
// };
// let output = generatefibonacciSequence(10);
// console.log(output);

//10. anagrams

// let checkAnagrams = (input1, input2) => {
//   let sortedInput1 = input1.split("").sort().join("");

//   let sortedInput2 = input2.split("").sort().join("");
//   if (sortedInput1 === sortedInput2) {
//     return "The given strings are anagrams";
//   } else {
//     return "The given strings are not anagrams";
//   }
// };
// let output = checkAnagrams("cat", "tac");
// console.log(output);

//11. Missing number

//12. remove duplicates

// const removeDuplicates = (input) => {
//   const newArray = [];
//   const indexofDuplicate = [];

//   input.forEach((value, i) => {
//     if (newArray.includes(value)) {
//       indexofDuplicate.push(i);
//     } else {
//       newArray.push(value);
//     }
//   });

//   const removeDuplication = input.filter(
//     (value, i) => !indexofDuplicate.includes(i)
//   );

//   return removeDuplication;
// };

// const output = removeDuplicates([1, "ram", 4, "ram", 4, "mohan", "mohan"]);
// console.log(output)

//13. Calculate the power

// const calculatePower = (base, exponent) => {
//   if (exponent < 0) {
//     return 1 / calculatePower(base, -exponent);
//   }
//   let result = 1;
//   for (let i = 0; i < exponent; i++) {
//     result *= base;
//   }
//   return result;
// };
// const output = calculatePower(2, 2);
// console.log(output);

//14. Merge sorted arrays.

// const mergeSortedArrays = (arr1, arr2) => {
//   let mergedArray = [];
//   let i = 0;
//   let j = 0;

//   for (; i < arr1.length && j < arr2.length; ) {
//     if (arr1[i] < arr2[j]) {
//       mergedArray.push(arr1[i]);
//       i++;
//     } else {
//       mergedArray.push(arr2[j]);
//       j++;
//     }
//   }

//   for (; i < arr1.length; i++) {
//     mergedArray.push(arr1[i]);
//   }
//   for (; j < arr2.length; j++) {
//     mergedArray.push(arr2[j]);
//   }

//   return mergedArray;
// };

// const output = mergeSortedArrays([1, 3, 7, 9, 60, 100], [2, 5, 6, 8, 10]);
// console.log(output);

//15. second largest number

// const findSecondLargest = (input) => {
//   if (input.length < 2) {
//     return "The array should have at least two elements to compare";
//   } else {
//     sortedInput = input.sort((a, b) => b - a);
//     return sortedInput[1];
//   }
// };

// const output = findSecondLargest([1, 10, 4, 7, 8]);
// console.log(output);

//16 Reverse words in a sentence

// const reverseWords = (input) => {
//   //   return input.split(" ").reverse().join(" ");
//   const inputArr = input.split(" ");
//   const reverseWords = inputArr.map((value, i) => {
//     return value.split("").reverse().join("");
//   });
//   return reverseWords.join(" ");
// };

// const output = reverseWords("Hello Amnil Tech, This is Nikesh Sapkota");
// console.log(output);

//17 validate email

// const validateEmail = (input) => {
//   const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
//   const validation = emailRegex.test(input);
//   if (validation) {
//     return "This is a valid email";
//   } else {
//     return "Email is invalid";
//   }
// };

// const output = validateEmail("nikeshgmail.com");
// console.log(output);

// 18. Intersection

// const findIntersection = (arr1, arr2) => {
//   const intersection = [];

//   arr1.forEach((value1) => {
//     arr2.forEach((value2) => {
//       if (value1 === value2 && !intersection.includes(value1)) {
//         intersection.push(value1);
//       }
//     });
//   });

//   return intersection;
// };

// const output = findIntersection([1, 2, 6, 9], [3, 2, 9, 20]);
// console.log(output);

//19. Bracket
