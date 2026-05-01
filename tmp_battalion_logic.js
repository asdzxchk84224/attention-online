
        window.setBattalionFilter = (val, el) => {
            currentBattalionFilter = val;
            // Update active state in dropdown
            document.querySelectorAll('#battalionDropBtn + .dropdown-menu .dropdown-item').forEach(item => item.classList.remove('active'));
            if(el) el.classList.add('active');

            // Update button text
            const btn = document.getElementById('battalionDropBtn');
            if (val === '1') btn.textContent = "一大隊";
            else if (val === '2') btn.textContent = "二大隊";
            else btn.textContent = "全大隊";

            renderAll();
        };

        // In renderAll, we need to filter groups based on battalion
        // logic: if val='1', only show classes starting with "一大"
        // if val='2', only show classes starting with "二大"
