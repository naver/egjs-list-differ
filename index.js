var beforeElement = document.querySelector(".before textarea");
var afterElement = document.querySelector(".after textarea");
var addedElement = document.querySelector(".result .added");
var removedElement = document.querySelector(".result .removed");
var changedElement = document.querySelector(".result .changed");
var pureChangedElement = document.querySelector(".result .pure-changed");
var updateElement = document.querySelector(".update");
var changeElement = document.querySelector("button.change");
var shuffleElement = document.querySelector("button.shuffle");

function diff() {
    var before = beforeElement.value.split(" ");
    var after = afterElement.value.split(" ");
    var result = eg.ListDiffer.diff(before, after, function (v) { return v; });
    var added = result.added;
    var removed = result.removed;
    var changed = result.changed;
    var pureChanged = result.pureChanged;
    var list = result.list;
    var prevList = result.prevList;


    addedElement.innerHTML = added.map(function (index) {
        return "<span>" + list[index] + "</span>";
    }).join("");
    removedElement.innerHTML = removed.map(function (index) {
        return "<span>" + prevList[index] + "</span>";
    }).join("");
    changedElement.innerHTML = changed.map(function (index) {
        return "<span>" + prevList[index[0]] + "</span>";
    }).join("");
    pureChangedElement.innerHTML = pureChanged.map(function (index) {
        return "<span>" + prevList[index[0]] + "</span>";
    }).join("");
}


updateElement.addEventListener("click", function () {
    diff();
});
changeElement.addEventListener("click", function () {
    var value = beforeElement.value;

    beforeElement.value = afterElement.value;
    afterElement.value = value;
    diff();
});
shuffleElement.addEventListener("click", function () {
    var arr = afterElement.value.split(" ");
    arr.sort(function () { return  Math.random() - 0.5; });

    afterElement.value = arr.join(" ");
    diff();
});

diff();
