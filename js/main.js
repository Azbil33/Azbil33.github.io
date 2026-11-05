async function getPosts() {

    const response = await fetch("posts/index.json");

    if (!response.ok) {
        throw new Error("Could not load article database.");
    }

    const data = await response.json();

    return data.posts || [];

}

async function loadCategories() {

    const container = document.getElementById("blog-categories");

    if (!container) return;

    try {

        const posts = await getPosts();

        container.innerHTML = "";

        if (posts.length === 0) {

            container.textContent = "No articles published yet.";
            return;

        }

        // Group articles by category

        const categories = {};

        posts.forEach(post => {

            const category = post.category || "Uncategorized";

            if (!categories[category]) {
                categories[category] = [];
            }

            categories[category].push(post);

        });


        // Create each category

        Object.entries(categories).forEach(([name, articles]) => {

            const details = document.createElement("details");
            details.className = "category";

            const summary = document.createElement("summary");
            summary.textContent = name;

            const postList = document.createElement("div");
            postList.className = "category-posts";


            // Create article links

            articles.forEach(post => {

                const link = document.createElement("a");

                link.href = "post.html?post=" +
                    encodeURIComponent(post.slug);

                link.textContent = post.title;

                const date = document.createElement("span");
                date.className = "post-link-date";
                date.textContent = post.date || "";

                link.appendChild(date);

                postList.appendChild(link);

            });


            details.appendChild(summary);
            details.appendChild(postList);

            container.appendChild(details);

        });

    } catch (error) {

        console.error("Category loading failed:", error);

        container.textContent =
            "Could not load articles. Please try again later.";

    }

}

async function loadArticle() {

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("post");

    if (!slug) {
        showError("No article was specified.");
        return;
    }

    try {

        const posts = await getPosts();

        const post = posts.find(item => item.slug === slug);

        if (!post) {
            showError("Article not found.");
            return;
        }

        const response = await fetch(post.file);

        if (!response.ok) {
            throw new Error("Could not load article file.");
        }

        const markdown = await response.text();

        document.getElementById("post-title").textContent = post.title;

        document.getElementById("post-date").textContent = post.date;

        document.getElementById("post-content").innerHTML =
            marked.parse(markdown);

        document.title = post.title + " | My Website";

    } catch (error) {

        console.error("Article loading failed:", error);

        showError("Something went wrong while loading this article.");

    }

}


function showError(message) {

    const content = document.getElementById("post-content");

    if (content) {
        content.textContent = message;
    }

}




if (document.getElementById("blog-categories")) {
    loadCategories();
}

// Article page

if (document.getElementById("post-content")) {
    loadArticle();
}
