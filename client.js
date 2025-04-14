document.addEventListener('DOMContentLoaded', function() {
    const dataTable = document.getElementById('dataTable');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const pagination = document.getElementById('pagination');
    const refreshBtn = document.getElementById('refreshBtn');
    
    let currentPage = 1;
    const pageSize = 20;
    
    // 初始加载数据
    fetchData(currentPage);
    
    // 刷新按钮点击事件
    refreshBtn.addEventListener('click', function() {
        fetchData(currentPage);
    });
    
    // 获取数据函数
    function fetchData(pageNumber) {
        // 显示加载中
        dataTable.innerHTML = '<tr><td colspan="6" class="text-center">加载中...</td></tr>';
        loading.classList.remove('d-none');
        error.classList.add('d-none');
        
        // 构建请求参数
        const requestOptions = {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'accept-language': 'zh-CN,zh;q=0.9',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'proxy-connection': 'keep-alive',
                'x-requested-with': 'XMLHttpRequest',
                'cookie': 'name=muzidxy; password=B28DC20381FC516462; SESSION=6b42c92b-cde7-4a51-8862-7d3580f96093',
                'Referer': 'http://yz.5yyz.com/manage/ProductListPage',
                'Referrer-Policy': 'strict-origin-when-cross-origin'
            },
            body: `destSoft=45387&destUser=0&userName=&dt1=&dt2=&agent=&data=&remark=&time=add&hourTime=1&pageNumber=${pageNumber}&pageSize=${pageSize}`
        };
        
        // 由于浏览器的同源策略限制，我们需要通过服务器代理来请求数据
        // 这里我们假设有一个本地API端点来代理请求
        fetch('/api/userSoftList', requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络响应不正常');
                }
                return response.json();
            })
            .then(data => {
                renderData(data);
                renderPagination(data.total || 100); // 假设总数为100，实际应该从API返回
                loading.classList.add('d-none');
            })
            .catch(err => {
                console.error('获取数据失败:', err);
                dataTable.innerHTML = '';
                error.classList.remove('d-none');
                loading.classList.add('d-none');
                
                // 模拟数据用于展示UI（实际环境中应删除）
                simulateData();
            });
    }
    
    // 渲染数据表格
    function renderData(data) {
        // 清空表格
        dataTable.innerHTML = '';
        
        // 如果没有数据
        if (!data || !data.rows || data.rows.length === 0) {
            dataTable.innerHTML = '<tr><td colspan="6" class="text-center">暂无数据</td></tr>';
            return;
        }
        
        // 渲染数据行
        data.rows.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.Online || '-'}</td>
                <td>${formatDate(item.expireTime) || '-'}</td>
                <td>${formatDate(item.firUseTime) || '-'}</td>
                <td>${item.remark || '-'}</td>
                <td>${item.state || '-'}</td>
            `;
            dataTable.appendChild(row);
        });
    }
    
    // 渲染分页
    function renderPagination(total) {
        const totalPages = Math.ceil(total / pageSize);
        pagination.innerHTML = '';
        
        // 上一页按钮
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`;
        prevLi.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                fetchData(currentPage);
            }
        });
        pagination.appendChild(prevLi);
        
        // 页码按钮
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageLi = document.createElement('li');
            pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
            pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pageLi.addEventListener('click', function(e) {
                e.preventDefault();
                currentPage = i;
                fetchData(currentPage);
            });
            pagination.appendChild(pageLi);
        }
        
        // 下一页按钮
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
        nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>`;
        nextLi.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                fetchData(currentPage);
            }
        });
        pagination.appendChild(nextLi);
    }
    
    // 格式化日期
    function formatDate(dateStr) {
        if (!dateStr) return '-';
        try {
            const date = new Date(dateStr);
            return date.toLocaleString('zh-CN');
        } catch (e) {
            return dateStr;
        }
    }
    
    // 模拟数据（仅用于展示UI，实际环境中应删除）
    function simulateData() {
        const mockData = {
            rows: [
                { id: 1, userName: '用户1', softName: '软件A', agent: '代理商1', remark: '备注信息', createTime: '2023-05-15 10:30:00' },
                { id: 2, userName: '用户2', softName: '软件B', agent: '代理商2', remark: '重要客户', createTime: '2023-05-16 14:20:00' },
                { id: 3, userName: '用户3', softName: '软件A', agent: '代理商1', remark: '', createTime: '2023-05-17 09:15:00' },
                { id: 4, userName: '用户4', softName: '软件C', agent: '代理商3', remark: '测试账号', createTime: '2023-05-18 16:45:00' },
                { id: 5, userName: '用户5', softName: '软件B', agent: '代理商2', remark: '', createTime: '2023-05-19 11:10:00' }
            ],
            total: 100
        };
        
        renderData(mockData);
        renderPagination(mockData.total);
    }
});