// API
const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

const issueContainer = document.getElementById("issue-container");
const spinner = document.getElementById("spinner");

// load all issues
const loadIssues = async () => {
   spinner.classList.remove("hidden");

   const res = await fetch(API_URL);
   const data = await res.json();

   displayIssues(data.data);

   spinner.classList.add("hidden");
};

// display issues
const displayIssues = (issues) => {

   issueContainer.innerHTML = "";

   issues.forEach(issue => {

      const card = document.createElement("div");

      // top border color
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

      issueContainer.appendChild(card);
   });
};

// initial load
loadIssues();