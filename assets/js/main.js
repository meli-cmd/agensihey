(function () {
  "use strict";
  const body = document.body;

  /* Header: kelas "scrolled" saat halaman digulir */
  const header = document.querySelector("#header");
  const onScroll = () => {
    if (header) body.classList.toggle("scrolled", window.scrollY > 60);
    const st = document.querySelector(".scroll-top");
    if (st) st.classList.toggle("active", window.scrollY > 300);
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("load", onScroll);

  /* Menu mobile */
  const toggleBtn = document.querySelector(".mobile-nav-toggle");
  const toggleNav = () => {
    body.classList.toggle("mobile-nav-active");
    toggleBtn.classList.toggle("bi-list");
    toggleBtn.classList.toggle("bi-x");
    toggleBtn.setAttribute("aria-expanded", body.classList.contains("mobile-nav-active"));
  };
  if (toggleBtn) toggleBtn.addEventListener("click", toggleNav);
  document.querySelectorAll("#navmenu a").forEach((a) =>
    a.addEventListener("click", () => {
      if (body.classList.contains("mobile-nav-active") && !a.querySelector(".toggle-dropdown")) toggleNav();
    })
  );
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((i) =>
    i.addEventListener("click", function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle("dropdown-toggle-active");
      this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
      e.stopImmediatePropagation();
    })
  );

  /* Preloader */
  const pre = document.querySelector("#preloader");
  if (pre) window.addEventListener("load", () => pre.remove());

  /* Tombol ke atas */
  const st = document.querySelector(".scroll-top");
  if (st) st.addEventListener("click", (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* Popup detail (layanan & portofolio) */
  const dlg = document.getElementById("popup");
  if (dlg) {
    const content = dlg.querySelector(".popup-body");
    const number = body.dataset.wa;
    const close = () => dlg.close();
    const open = (id) => {
      const src = document.getElementById(id);
      if (!src) return;
      content.innerHTML = src.innerHTML;
      content.querySelectorAll("[data-wa-text]").forEach((a) => {
        a.href = "https://wa.me/" + number + "?text=" + encodeURIComponent(a.dataset.waText);
        a.target = "_blank";
        a.rel = "noopener";
      });
      content.scrollTop = 0;
      dlg.showModal();
      body.classList.add("no-scroll");
    };
    document.querySelectorAll("[data-popup]").forEach((el) =>
      el.addEventListener("click", () => open(el.dataset.popup))
    );
    dlg.querySelector(".popup-close").addEventListener("click", close);
    dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); });
    dlg.addEventListener("close", () => body.classList.remove("no-scroll"));
  }

  /* Formulir kontak -> WhatsApp */
  const form = document.getElementById("wa-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const text = "Halo, saya " + d.get("nama") + ". Saya tertarik dengan layanan " + d.get("layanan") +
        ".\n\n" + d.get("pesan");
      window.open("https://wa.me/" + body.dataset.wa + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    });
  }

  /* Scrollspy ringan untuk menu di beranda */
  const links = document.querySelectorAll(".navmenu a[href^=\"#\"], .navmenu a[href^=\"index.html#\"]");
  if (document.body.classList.contains("index-page") && "IntersectionObserver" in window) {
    const map = new Map();
    links.forEach((a) => { const el = document.querySelector(a.hash); if (el) map.set(el, a); });
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) {
        document.querySelectorAll(".navmenu a.active").forEach((x) => x.classList.remove("active"));
        map.get(en.target).classList.add("active");
      }
    }), { rootMargin: "-40% 0px -55% 0px" });
    map.forEach((_, el) => io.observe(el));
  }

  

  /* Daftar Isi: scroll ke tengah layar tanpa mengubah URL */
  document.querySelectorAll(".toc-list a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href").replace("#", "");
      const target = document.getElementById(targetId);
      if (!target) return;

      // Hitung posisi agar target berada di tengah viewport
      const targetRect = target.getBoundingClientRect();
      const targetCenter = targetRect.top + window.scrollY + targetRect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const scrollTo = targetCenter - viewportCenter;

      window.scrollTo({ top: scrollTo, behavior: "smooth" });

      // URL tidak berubah - gunakan replaceState agar tidak ada #s1 di URL
      // (tidak memanggil pushState agar riwayat browser tidak bertambah)
    });
  });
})();
