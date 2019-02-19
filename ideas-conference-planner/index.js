const ipc = require('electron').ipcRenderer;
var tb = null;
function getAttendeeName(attendee) {
  return attendee == null ? "" : (attendee.prefix == null ? "" : attendee.prefix) + ' ' + attendee.first + ' ' + attendee.last;
}

function getReviewer(review) {
  if (review[0] != null) {
    reviewer = review[0].ReviewReviewer;
    return reviewer.first + ' ' + reviewer.last;
  } else {
    return '';
  }
}

function getReview(review) {
  if (review[0] != null) {
    review = review[0]
    totalscore = review.content_rating+review.credibility_rating+review.grammar_rating+review.interest_rating+review.novelty_rating+review.overall_rating+review.title_rating;
    return totalscore + '/21';
  } else {
    return '';
  }
}


function ratePresentation(rowID, presID) {
  var button = document.createElement('button');
  button.textContent = 'Rate';
  var actionSpace = document.getElementById('actions' + rowID);

  button.addEventListener('click', () => {
    // stores the raw html data for the row in session storage.
    sessionStorage.presTitle = document.getElementById(rowID).cells[2].innerHTML;
    sessionStorage.presDesc = document.getElementById(rowID).cells[3].innerHTML;
    sessionStorage.presObj1 = document.getElementById(rowID).cells[4].innerHTML;
    sessionStorage.presObj2 = document.getElementById(rowID).cells[5].innerHTML;
    sessionStorage.presObj3 = document.getElementById(rowID).cells[6].innerHTML;
    sessionStorage.presID = presID;
    window.location = "index-rating.html";
  }, false)

  actionSpace.appendChild(button);
}

function generateTable(data) {
  var presentationDiv = document.getElementById('presentationDiv');
  var table = document.createElement('table');
  table.id = 'PresentationTable';

  table.setAttribute('border','1');
  table.setAttribute('width','100%');
  table.setAttribute('id', 'table');
  var numRows = data.length;
  var row = table.insertRow(0);

  var th = document.createElement('th');
  th.appendChild(document.createTextNode('Actions'));
  row.appendChild(th);

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Date'));
  row.appendChild(th);
  th.onclick= function(){sortTable(0);} ; 

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Title'));
  th.onclick= function(){sortTable(1);} ; 
  row.appendChild(th);

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Description'));
  row.appendChild(th);

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Objective 1'));
  row.appendChild(th);

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Objective 2'));
  row.appendChild(th);

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Objective 3'));
  row.appendChild(th);

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Presenter'));
  row.appendChild(th);

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Co-Presenter 1'));
  row.appendChild(th);

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Co-Presenter 2'));
  row.appendChild(th);

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Co-Presenter 3'));
  row.appendChild(th);

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Reviewer'));
  row.appendChild(th);

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Review'));
  row.appendChild(th);

  for (i = 0; i < numRows; ++i) {
    var row = table.insertRow(i + 1);
    row.id =  i;

    var td = document.createElement('td');
    td.id = 'actions' + i;
    td.appendChild(document.createTextNode(''));
    row.appendChild(td);


    td = document.createElement('td');
    td.appendChild(document.createTextNode(data[i].submission_date.slice(0, 10)));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(data[i].title));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(data[i].description));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(data[i].objective_1));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(data[i].objective_2));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(data[i].objective_3));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(getAttendeeName(data[i].Presenter)));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(getAttendeeName(data[i].Copresenter1)));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(getAttendeeName(data[i].Copresenter2)));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(getAttendeeName(data[i].Copresenter3)));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(getReviewer(data[i].PresentationReview)));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(getReview(data[i].PresentationReview)));
    row.appendChild(td);
    row.onclick= function () {
      console.log(data[this.id]);
      if (tb == null){
        tb = this;
        this.style.backgroundColor = this.origColor;
        //this.hilite = false;
        this.origColor=this.style.backgroundColor;
        this.style.backgroundColor='#BCD4EC';
        this.hilite = true;
        ratePresentation(this.id, data[this.id].id);
      } else {
        tb.style.backgroundColor=tb.origColor;
        tb.hilite = false;
        this.style.backgroundColor = this.origColor;
        //this.hilite = false;
        this.origColor=this.style.backgroundColor;
        this.style.backgroundColor='#BCD4EC';
        this.hilite = true;
        var actionSpace = document.getElementById('actions' + tb.id);
        tb = this;

        actionSpace.innerHTML = '';
        ratePresentation(this.id);

      }
    }


  }

  presentationDiv.innerHTML = '';
  presentationDiv.appendChild(table);
}


function refreshPresentations() {
  ipc.send('query-presentations', '');
}

document.addEventListener('DOMContentLoaded', refreshPresentations);

document.getElementById("getjotfile").addEventListener("change", ingestCSV);

function ingestCSV() {
  var jotfile = document.getElementById("getjotfile");
  ipc.send('ingest-csv', jotfile.files[0].path);
}

ipc.on('ingest-csv', function(event, arg) {
  alert(arg);
});

ipc.on('query-presentations-reply', function(event, arg) {
  var query = JSON.parse(arg);
  generateTable(query);
});

function sortTable(n) {
        console.log("sorting")
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.getElementById("table");
        switching = true;
        dir = "asc"; 
        while (switching) {
            switching = false;
            rows = table.getElementsByTagName("tr");
            for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[n];
            y = rows[i + 1].getElementsByTagName("td")[n];
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch= true;
                break;
            }
        } else if (dir == "desc") {
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch= true;
            break;
            }
        }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++; 
        } else {
        if (switchcount == 0 && dir == "asc") {
            dir = "desc";
            switching = true;
        }
        }
        }
    }
function searchFunc() {
  // Declare variables 
  console.log("searching");
  var input, filter, table, tr, td, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("table");
  tr = table.getElementsByTagName("tr");
  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    } 
  }
}