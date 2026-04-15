// API
const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
const SINGLE_API = "https://phi-lab-server.vercel.app/api/v1/lab/issue/";
const SEARCH_API = "https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=";

const issueContainer = document.getElementById("issue-container");
const spinner = document.getElementById("spinner");

// modal
const modal = document.getElementById("issue_modal");
const modalContent = document.getElementById("modal-content");

// buttons
const btnAll = document.getElementById("btn-all");
const btnOpen = document.getElementById("btn-open");
const btnClosed = document.getElementById("btn-closed");

// search
const searchInput = document.getElementById("search-input");
const btnSearch = document.getElementById("btn-search");

let allIssues = [];

// load all issues
const loadIssues = async () => {
   spinner.classList.remove("hidden");

   const res = await fetch(API_URL);
   const data = await res.json();

   allIssues = data.data;

   displayIssues(allIssues);

   spinner.classList.add("hidden");
};

// display issues
const displayIssues = (issues) => {

   issueContainer.innerHTML = "";

   issues.forEach(issue => {

      const card = document.createElement("div");

      const borderColor =
         issue.status === "open"
            ? "border-t-4 border-green-500"
            : "border-t-4 border-purple-500";

      card.className = `
         bg-white p-4 rounded shadow-sm ${borderColor}
         cursor-pointer hover:shadow-md transition
      `;

      card.innerHTML = `
         <h2 class="font-semibold text-sm mb-2">${issue.title}</h2>
         <p class="text-xs text-gray-500 mb-3">
            ${issue.description.slice(0, 80)}...
         </p>
         <div class="text-xs space-y-1">
            <p><strong>Status:</strong> ${issue.status}</p>
            <p><strong>Author:</strong> ${issue.author}</p>
            <p><strong>Priority:</strong> ${issue.priority}</p>
            <p><strong>Label:</strong> ${issue.label}</p>
         </div>
      `;

      // modal click
      card.addEventListener("click", () => {
         loadSingleIssue(issue.id);
      });

      issueContainer.appendChild(card);
   });
};

// single issue
const loadSingleIssue = async (id) => {
   const res = await fetch(SINGLE_API + id);
   const data = await res.json();
   showModal(data.data);
};

// modal show
const showModal = (issue) => {
   modalContent.innerHTML = `
      <h2 class="text-lg font-bold">${issue.title}</h2>
      <p class="text-sm text-gray-500">${issue.description}</p>

      <div class="text-sm space-y-1">
         <p><strong>Status:</strong> ${issue.status}</p>
         <p><strong>Author:</strong> ${issue.author}</p>
         <p><strong>Priority:</strong> ${issue.priority}</p>
         <p><strong>Label:</strong> ${issue.label}</p>
         <p><strong>Created At:</strong> ${issue.createdAt}</p>
      </div>
   `;

   modal.showModal();
};

// active button
const setActive = (activeBtn) => {
   [btnAll, btnOpen, btnClosed].forEach(btn => {
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-outline");
   });

   activeBtn.classList.remove("btn-outline");
   activeBtn.classList.add("btn-primary");
};

// tabs
btnAll.addEventListener("click", () => {
   setActive(btnAll);
   displayIssues(allIssues);
});

btnOpen.addEventListener("click", () => {
   setActive(btnOpen);
   const openIssues = allIssues.filter(i => i.status === "open");
   displayIssues(openIssues);
});

btnClosed.addEventListener("click", () => {
   setActive(btnClosed);
   const closedIssues = allIssues.filter(i => i.status === "closed");
   displayIssues(closedIssues);
});

// 🔍 search functionality
btnSearch.addEventListener("click", async () => {

   const text = searchInput.value;

   if (!text) return;

   spinner.classList.remove("hidden");

   const res = await fetch(SEARCH_API + text);
   const data = await res.json();

   displayIssues(data.data);

   spinner.classList.add("hidden");
});

// initial
loadIssues();
setActive(btnAll);