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
   try {
      spinner.classList.remove("hidden");

      const res = await fetch(API_URL);
      const data = await res.json();

      allIssues = data.data;

      displayIssues(allIssues);
   } catch (err) {
      // console.error("Error loading issues:", err);
   } finally {
      spinner.classList.add("hidden");
   }
};

// display issues
const displayIssues = (issues) => {
   issueContainer.innerHTML = "";

   if (issues.length === 0) {
      issueContainer.innerHTML = `<p class="text-center text-gray-500">No issues found</p>`;
      return;
   }

   issues.forEach(issue => {
      const card = document.createElement("div");

      const borderColor =
         issue.status === "open"
            ? "border-t-4 border-green-500"
            : "border-t-4 border-purple-500";

      card.className = `
         bg-white p-7 rounded shadow-sm ${borderColor}
         cursor-pointer hover:shadow-md transition
      `;

      card.innerHTML = `
         <h2 class="font-semibold text-[14px] mb-2">${issue.title}</h2>

         <p class="text-[12px] text-gray-500 mb-3 line-clamp-2">
            ${issue.description}...
         </p>
         


         <div class="mb-3 flex flex-wrap gap-1">${issue.labels.map(label => {
         let colorClass = "";
         if (label.toLowerCase() === "bug") {
            colorClass = "bg-[#EF444440] text-error-content";
         }
         else if (label.toLowerCase() === "documentation") {
            colorClass = "bg-[#4A00FF40]";
         }
         else if (label.toLowerCase() === "duplicate") {
            colorClass = "bg-[#A855F740] text-secondary-content";
         }
         else if (label.toLowerCase() === "enhancement") {
            colorClass = "bg-[#BBF7D040] text-accent-content";
         }
         else if (label.toLowerCase() === "good first issue") {
            colorClass = "bg-[#9CA3AF40] text-accent-content";
         }
         else if (label.toLowerCase() === "help wanted") {
            colorClass = "bg-[#FDE68A40] text-info-content";
         }
         else {
            colorClass = "bg-gray-200";
         }

         return `
         <button class="text-[10px] px-2 py-[2px] rounded ${colorClass}">
            ${label.toUpperCase()}
         </button>
         `;
      }).join("")}
         </div>

         <hr class="border-gray-200" />

         <div class="text-xs space-y-2 mt-2">
            
            <p><strong>Author:</strong> ${issue.author}</p>
            <p><strong>Created At:</strong> ${new Date(issue.createdAt).toLocaleString()}</p>
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
   try {
      const res = await fetch(SINGLE_API + id);
      const data = await res.json();
      showModal(data.data);
   } catch (err) {
      // console.error("Error loading single issue:", err);
   }
};

// modal show
const showModal = (issue) => {

   // 🔥 Status color
   const statusClass = issue.status.toLowerCase() === "open"
      ? "badge-success"
      : "badge-primary";

   // 🔥 Priority color
   let priorityClass = "";
   if (issue.priority.toLowerCase() === "high") {
      priorityClass = "badge-error";
   } else if (issue.priority.toLowerCase() === "medium") {
      priorityClass = "badge-warning";
   } else {
      priorityClass = "badge-success";
   }

   modalContent.innerHTML = `
    
    <!-- Title -->
    <h2 class="text-xl font-semibold mb-2">
      ${issue.title}
    </h2>

    <!-- Status + Meta -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-3">
      <span class="badge ${statusClass} badge-sm capitalize">
        ${issue.status}
      </span>
      <span>Opened by ${issue.assignee}</span>
    </div>

    <!-- Labels -->
    <div class="mb-3 flex flex-wrap gap-2">
      ${issue.labels.map(label => {

      let colorClass = "";

      if (label.toLowerCase() === "bug") {
         colorClass = "bg-red-200 text-red-600";
      }
      else if (label.toLowerCase() === "help wanted") {
         colorClass = "bg-yellow-200 text-yellow-700";
      }
      else {
         colorClass = "bg-gray-200 text-gray-600";
      }

      return `
          <span class="text-xs px-2 py-1 rounded-full font-medium ${colorClass}">
            ${label.toUpperCase()}
          </span>
        `;
   }).join("")}
    </div>
    <p class="text-sm text-gray-600 mb-4">
      ${issue.description}
    </p>
    <div class="bg-gray-100 p-4 rounded-lg flex justify-between items-center mb-4">
      
      <div>
        <p class="text-sm text-gray-500">Assignee:</p>
        <p class="font-semibold">${issue.assignee}</p>
      </div>

      <div>
        <p class="text-sm text-gray-500">Priority:</p>
        <span class="badge ${priorityClass} badge-sm uppercase">
          ${issue.priority}
        </span>
      </div>

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

// search functionality
btnSearch.addEventListener("click", async () => {
   const text = searchInput.value.trim();

   if (!text) return;

   try {
      spinner.classList.remove("hidden");

      const res = await fetch(SEARCH_API + text);
      const data = await res.json();

      displayIssues(data.data);
   } catch (err) {
      // console.error("Search error:", err);
   } finally {
      spinner.classList.add("hidden");
   }
});

// enter press search
searchInput.addEventListener("keypress", (e) => {
   if (e.key === "Enter") {
      btnSearch.click();
   }
});

// initial load
loadIssues();
setActive(btnAll);