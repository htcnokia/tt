// ==================== 全局配置 ====================
const CONFIG = {
    DOWNLOADS_DIR: '/downloads',
    METABASE_API: '/api/metabase-dashboard',
    N8N_WEBHOOKS: {
        purchase: '/data/kingdee-purchase-orders',
        sales: '/data/kingdee-sales-orders',
        production: '/data/kingdee-production-orders',
        inventory: '/data/kingdee-inventory-orders',
        calendar: '/data/nextcloud-calendar',
        milestone: '/data/kingdee-smp-orders',
        techtransfer: '/data/nextcloud-tables-tt',
        hr: '/data/nextcloud-tables-hr',
        dept: '/data/nextcloud-tables-dpt'
    },
    // 移除 JSON_FILES 的硬编码，改为动态生成
    PERFORMANCE: {
        VIRTUAL_SCROLL_THRESHOLD: 50000,
        BATCH_RENDER_SIZE: 1000,
        DEBOUNCE_DELAY: 50,
        BUFFER_ROWS: 10
    }
};

// ==================== 动态文件名生成器 ====================
const FileNameManager = {
    // 获取用户特定的文件名
    getFileName(tabId) {
        const baseFiles = {
            purchase: 'kingdee_pur_orders',
            sales: 'kingdee_sales_orders', 
            production: 'kingdee_production_orders',
            inventory: 'kingdee_inventory_orders',
            calendar: 'nextcloud_calendar',
            milestone: 'kingdee_smp_orders',
            techtransfer: 'nextcloud_techtransfer',
            hr: 'nextcloud_hr',
            dept: 'nextcloud_dpt'
        };
        
        const baseName = baseFiles[tabId];
        if (!baseName) {
            console.error('❌ 未找到对应Tab的文件名:', tabId);
            return null;
        }
        
        // 获取用户账号，如果没有登录则使用匿名
        const userAccount = STATE.userInfo.userId || 'anonymous';
        
        // 生成用户特定的文件名，例如: kingdee_pur_orders_ZhangMengAn.json
        const fileName = `${baseName}_${userAccount}.json`;
        
        console.log(`📁 生成文件名: ${fileName} (用户: ${userAccount})`);
        return fileName;
    },
    
    // 获取所有Tab的文件名映射
    getAllFileNames() {
        const fileNames = {};
        const tabs = ['purchase', 'sales', 'production', 'inventory', 'calendar', 'milestone', 'techtransfer', 'hr', 'dept'];
        
        tabs.forEach(tabId => {
            fileNames[tabId] = this.getFileName(tabId);
        });
        
        return fileNames;
    }
};

// 个人权限配置 - 优先于部门权限
const USER_PERMISSIONS = {
    // 示例：特定用户的专属权限
    'YaYu': ['purchase', 'sales', 'production', 'inventory', 'calendar', 'milestone','techtransfer', 'hr', 'dept'],
    'GHui': ['purchase', 'sales', 'production', 'inventory', 'calendar', 'milestone','techtransfer', 'hr', 'dept'],
    'ZanengAn': ['purchase', 'sales', 'production', 'inventory', 'calendar', 'milestone','techtransfer', 'hr', 'dept'], 
    'Fengeni': ['purchase', 'sales', 'production', 'inventory', 'calendar', 'milestone','techtransfer', 'hr', 'dept'], 
    'mael': ['purchase', 'sales', 'production', 'inventory', 'calendar', 'milestone','techtransfer', 'hr', 'dept'], 
    'tnce': ['purchase', 'sales', 'production', 'inventory', 'calendar', 'milestone','techtransfer', 'hr', 'dept'],
    'Leng': ['purchase', 'sales', 'production', 'inventory', 'calendar', 'milestone','techtransfer', 'hr', 'dept']	
    // 可以继续添加其他用户的专属权限
};

// 部门权限配置 - 使用企业微信中的实际部门名称
const DEPT_PERMISSIONS = {
    // 工程部权限
    '工程部': ['overview', 'milestone','techtransfer', 'hr', 'dept'],
    // 采购部权限  
    '采购部': ['overview', 'purchase', 'inventory', 'hr', 'dept'],
    // 用戶权限
    'KIS HK': ['overview', 'purchase', 'sales', 'production', 'inventory', 'calendar', 'milestone','techtransfer', 'hr', 'dept'],
    // 生产部权限
    '生產部': ['overview', 'production', 'inventory', 'hr', 'dept'],
    // 營運部权限 - 所有tab
    '營運部': ['overview', 'purchase', 'sales', 'production', 'inventory', 'calendar', 'milestone','techtransfer', 'hr', 'dept'],
    // IT部权限
    'IT部': [ 'overview','purchase', 'sales', 'production', 'inventory', 'calendar', 'milestone','techtransfer', 'hr', 'dept'],
	//會計部
    '會計部': ['overview', 'purchase', 'sales', 'production', 'inventory', 'calendar', 'milestone','techtransfer', 'hr', 'dept'],
	//會計部/成本組
    '會計部/成本組': ['purchase', 'sales', 'production', 'inventory', 'calendar', 'milestone','techtransfer', 'hr', 'dept'],
	//廠務部
    '廠務部': ['overview', 'purchase', 'sales', 'production', 'inventory', 'calendar', 'milestone','techtransfer', 'hr', 'dept'],
    // 行政部权限
    '行政部': ['overview', 'purchase', 'sales', 'production', 'inventory', 'calendar', 'milestone','techtransfer', 'hr', 'dept'],
    // 供應鏈管理部权限 
    '供應鏈管理部': ['purchase', 'sales', 'production', 'inventory', 'calendar', 'milestone','techtransfer', 'hr', 'dept'],	
    // 人力資源部权限
    '人力資源部': ['milestone', 'hr', 'dept'],
    // 默认权限
    'default':  [ 'milestone','techtransfer', 'hr', 'dept']
};

// 字符筛选字段配置
const TEXT_FILTER_CONFIG = {
    inventory: [
        { value: 'FMaterialid.FNumber', label: '物料編碼' },
        { value: 'FMaterialid.FName', label: '物料名稱' },
        { value: 'FMaterialid.FSpecification', label: '規格型號' },
        { value: 'FSTOCKORGID.FName', label: '倉庫名稱' }
    ],
    sales: [
        { value: 'FMaterialid.FNumber', label: '物料編碼' },
        { value: 'FMaterialid.FName', label: '物料名稱' },
        { value: 'FMaterialid.FSpecification', label: '規格型號' },
        { value: 'F_khpp', label: '客戶' },
        { value: 'F_XVKJ_khhk', label: '款號' },
        { value: 'F_XVKJ_Text_83g', label: 'PO' },
        { value: 'F_XVKJ_SCN', label: '市場' }
    ],
    purchase: [
        { value: 'FMaterialid.FNumber', label: '物料編碼' },
        { value: 'FMaterialid.FName', label: '物料名稱' },
        { value: 'FMaterialid.FSpecification', label: '規格型號' },
        { value: 'FSupplierId.FName', label: '供應商' },
        { value: 'FPURCHASERID.FName', label: '採購員' }
    ],
    production: [
        { value: 'FMaterialid.FNumber', label: '物料編碼' },
        { value: 'FMaterialid.FName', label: '物料名稱' },
        { value: 'FMaterialid.FSpecification', label: '規格型號' },
        { value: 'FWORKSHOPID.FName', label: '生產車間' },
        { value: 'FBillno', label: '生產訂單號' },
        { value: 'FSALEORDERNO', label: '需求單號' }		
    ],
    milestone: [
        { value: 'FMaterialid.FNumber', label: '物料編碼' },
        { value: 'FMaterialid.FName', label: '物料名稱' },
        { value: 'F_XVKJ_nyd', label: '難易度' },
        { value: 'F_khpp', label: '客戶' },
        { value: 'F_XVKJ_khhk', label: '款號' }
    ],
    techtransfer: [
        { value: 'FMaterialid.FNumber', label: '物料編碼' },
        { value: 'FMaterialid.FName', label: '物料名稱' },
        { value: 'F_khpp', label: '客戶品牌' },
        { value: 'F_XVKJ_khhk', label: '款號' }
    ],	
    hr: [
        { value: '姓名', label: '姓名' },
        { value: '部门', label: '部門' },
        { value: '职位', label: '職位' }
    ],
    dept: [
        { value: '部门名称', label: '部門名稱' },
        { value: '负责人', label: '負責人' }
    ],
    calendar: [
        { value: '事件标题', label: '事件標題' },
        { value: '参与人', label: '參與人' },
        { value: '地点', label: '地點' }
    ]
};

// 全局状态
const STATE = {
    currentTab: 'overview',
    charts: new Map(),
    scrollSpeed: parseFloat(localStorage.getItem('scroll-speed')) || 0.5,
    theme: {
        primary: localStorage.getItem('theme-primary') || '#007a7a',
        dark: localStorage.getItem('dark-mode') === 'true',
        chartTheme: localStorage.getItem('chart-theme') || 'default'
    },
    filters: {},
    userInfo: {
        userId: null,
        userName: null,
        departments: []
    },
    virtualTables: new Map() // 存储虚拟表格实例
};

// ==================== 虚拟滚动表格渲染器 ====================
const VirtualTableRenderer = {
    init(tableId, data, columns) {
        console.log(`🎯 初始化虚拟滚动表格: ${tableId}, 数据量: ${data.length}行`);
        
        this.tableId = tableId;
        this.data = data;
        this.columns = columns;
        this.container = document.getElementById(`${tableId}-scroll`);
        
        if (!this.container) {
            console.error('❌ 虚拟滚动容器未找到:', `${tableId}-scroll`);
            return;
        }
        
        // 智能测量行高
        this.rowHeight = this.measureRowHeight();
        this.viewportHeight = this.container.clientHeight;
        this.buffer = CONFIG.PERFORMANCE.BUFFER_ROWS;
        
        this.visibleStart = 0;
        this.visibleEnd = 0;
        this.renderedRows = new Map();
        this.lastScrollTop = 0;
        
        this.initVirtualScrollDOM();
        this.renderHeader();
        this.calculateVisibleRange();
        this.renderVisibleRows();
        
        // 存储实例以便后续管理
        STATE.virtualTables.set(tableId, this);
        
        console.log(`✓ 虚拟滚动初始化完成，行高: ${this.rowHeight}px, 可见区域: ${this.viewportHeight}px`);
    },

    measureRowHeight() {
        // 创建测试行来测量实际行高
        const testRow = document.createElement('tr');
        testRow.innerHTML = '<td style="padding: 8px; border: 1px solid #ddd;">测试行高</td>';
        testRow.style.visibility = 'hidden';
        testRow.style.position = 'absolute';
        
        const testTable = document.createElement('table');
        testTable.style.borderCollapse = 'collapse';
        testTable.appendChild(testRow);
        document.body.appendChild(testTable);
        
        const height = testRow.offsetHeight;
        document.body.removeChild(testTable);
        
        // 返回测量高度或默认值
        return Math.max(height, 35); // 最小行高35px
    },

    initVirtualScrollDOM() {
        // 保存原始表格结构但隐藏
        const originalTable = this.container.querySelector('table');
        if (originalTable) {
            originalTable.style.display = 'none';
        }
        
        // 创建虚拟滚动结构
        this.container.innerHTML = `
            <div class="virtual-scroll-viewport" style="height: 100%; overflow: auto; position: relative;">
                <div class="virtual-scroll-content" style="height: ${this.data.length * this.rowHeight}px;">
                    <table class="detail-table" style="width: 100%; border-collapse: collapse; table-layout: fixed;">
                        <thead id="${this.tableId}-head-virtual"></thead>
                        <tbody id="${this.tableId}-body-virtual" style="position: relative;"></tbody>
                    </table>
                </div>
            </div>
            <div class="virtual-scroll-info" style="position: absolute; top: 5px; right: 5px; background: rgba(0,0,0,0.7); color: white; padding: 2px 5px; border-radius: 3px; font-size: 12px; display: none;">
                虚拟滚动模式
            </div>
        `;
        
        this.viewport = this.container.querySelector('.virtual-scroll-viewport');
        this.content = this.container.querySelector('.virtual-scroll-content');
        this.tbody = document.getElementById(`${this.tableId}-body-virtual`);
        this.info = this.container.querySelector('.virtual-scroll-info');
        
        // 显示虚拟滚动提示
        this.info.style.display = 'block';
        
        // 绑定优化后的滚动事件
        this.viewport.addEventListener('scroll', Utils.debounce(() => {
            this.handleScroll();
        }, CONFIG.PERFORMANCE.DEBOUNCE_DELAY));
        
        // 窗口大小变化时重新计算
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 100));
    },

    handleResize() {
        const newViewportHeight = this.container.clientHeight;
        if (Math.abs(this.viewportHeight - newViewportHeight) > 10) {
            this.viewportHeight = newViewportHeight;
            this.calculateVisibleRange();
            this.renderVisibleRows();
            console.log(`🔄 虚拟滚动自适应调整，新高度: ${this.viewportHeight}px`);
        }
    },

    renderHeader() {
        const thead = document.getElementById(`${this.tableId}-head-virtual`);
        if (!thead) return;
        
        // 获取原始表格的表头宽度作为参考
        const originalThead = document.getElementById(`${this.tableId}-head`);
        let columnWidths = [];
        
        if (originalThead) {
            const originalThs = originalThead.querySelectorAll('th');
            columnWidths = Array.from(originalThs).map(th => {
                const width = th.style.width || th.offsetWidth + 'px';
                return { width, minWidth: width, maxWidth: width };
            });
        }
        
        thead.innerHTML = `<tr>${this.columns.map((col, index) => {
            const widthInfo = columnWidths[index] || {};
            return `
                <th data-column="${col}" data-index="${index}" 
                    style="position: sticky; top: 0; background: ${STATE.theme.primary}; color: white; padding: 8px; border: 1px solid #ddd;
                           width: ${widthInfo.width || 'auto'}; min-width: ${widthInfo.minWidth || '100px'}; max-width: ${widthInfo.maxWidth || '300px'}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    ${col}
                    <span class="column-resizer"></span>
                </th>
            `;
        }).join('')}</tr>`;
        
        // 初始化列宽调整
        this.initColumnResize(thead);
    },

    calculateVisibleRange() {
        const scrollTop = this.viewport.scrollTop;
        this.visibleStart = Math.max(0, Math.floor(scrollTop / this.rowHeight) - this.buffer);
        this.visibleEnd = Math.min(
            this.data.length, 
            Math.ceil((scrollTop + this.viewportHeight) / this.rowHeight) + this.buffer
        );
    },

    renderVisibleRows() {
        const fragment = document.createDocumentFragment();
        const rowsToRemove = [];
        
        // 标记需要移除的行
        this.renderedRows.forEach((rowElement, index) => {
            if (index < this.visibleStart || index >= this.visibleEnd) {
                rowsToRemove.push(index);
            }
        });
        
        // 移除不可见的行
        rowsToRemove.forEach(index => {
            const rowElement = this.renderedRows.get(index);
            if (rowElement) {
                rowElement.remove();
                this.renderedRows.delete(index);
            }
        });

        // 渲染新的可见行
        for (let i = this.visibleStart; i < this.visibleEnd; i++) {
            if (!this.renderedRows.has(i)) {
                const rowElement = this.createRow(i, this.data[i]);
                rowElement.style.position = 'absolute';
                rowElement.style.top = `${i * this.rowHeight}px`;
                rowElement.style.left = '0';
                rowElement.style.width = '100%';
                rowElement.style.height = `${this.rowHeight}px`;
                
                fragment.appendChild(rowElement);
                this.renderedRows.set(i, rowElement);
            }
        }
        
        if (fragment.children.length > 0) {
            this.tbody.appendChild(fragment);
        }
        
        // 更新信息显示
        this.updateInfoDisplay();
    },

	createRow(index, rowData) {
		const tr = document.createElement('tr');
		tr.style.borderLeft = `4px solid ${Utils.generateColor(index)}`;
		tr.style.display = 'table-row';
		tr.style.width = '100%';
		tr.style.background = index % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)';
		
		// 获取表头列宽信息
		const thead = document.getElementById(`${this.tableId}-head-virtual`);
		const ths = thead ? thead.querySelectorAll('th') : [];
		
		this.columns.forEach((col, colIndex) => {
			const td = document.createElement('td');
			const { value: rawValue } = Utils.smartGetValue(rowData, this.columns, colIndex);
			let value = rawValue ?? '';
			
			// 应用与表头相同的列宽
			if (ths[colIndex]) {
				const th = ths[colIndex];
				td.style.width = th.style.width || 'auto';
				td.style.minWidth = th.style.minWidth || '100px';
				td.style.maxWidth = th.style.maxWidth || '300px';
			}
			
			// 样式设置
			td.style.padding = '8px';
			td.style.border = 'none';
			td.style.borderBottom = '1px solid #f0f0f0';
			td.style.whiteSpace = 'nowrap';
			td.style.overflow = 'hidden';
			td.style.textOverflow = 'ellipsis';
			td.style.boxSizing = 'border-box';
			td.setAttribute('data-full-content', value || '');
			
			// ⚠️ 关键：检查是否包含URL
			const hasUrl = value && /(https?:\/\/[^\s]+)/i.test(String(value));
			
			// 优化内容显示
			if (value && typeof value === 'string') {
				if (value.length > 80) {
					// 超长内容：截断显示
					const displayText = value.substring(0, 100) + '...';
					
					if (hasUrl) {
						// 如果有URL，处理URL但只显示前100字符
						const processedShort = Utils.processCellContent(displayText);
						td.innerHTML = processedShort;
					} else {
						td.textContent = displayText;
					}
					
					td.title = ''; // 清除默认title
					td.classList.add('truncated');
					
					// 悬停显示完整内容
					td.addEventListener('mouseenter', () => {
						Utils.showSmartTooltip(td, value, 'hover');
					});
					
					// 点击固定显示
					td.style.cursor = 'pointer';
					td.addEventListener('click', (e) => {
						// 如果点击的是链接，不显示tooltip
						if (e.target.classList.contains('cell-link')) {
							return;
						}
						Utils.showSmartTooltip(td, value, 'click');
					});
					
				} else if (value.length > 30) {
					// 中等长度：截断显示
					const displayText = value.substring(0, 50) + '...';
					
					if (hasUrl) {
						const processedShort = Utils.processCellContent(displayText);
						td.innerHTML = processedShort;
					} else {
						td.textContent = displayText;
					}
					
					td.title = '';
					td.classList.add('truncated');
					
					// 只用悬停显示
					td.addEventListener('mouseenter', () => {
						Utils.showSmartTooltip(td, value, 'hover');
					});
					
				} else {
					// 短内容：完整显示
					if (hasUrl) {
						// 处理URL为可点击链接
						const processed = Utils.processCellContent(value);
						td.innerHTML = processed;
					} else {
						td.textContent = value;
					}
				}
			} else {
				td.textContent = value || '';
			}
			
			tr.appendChild(td);
		});
		
		return tr;
	},

    updateInfoDisplay() {
        if (!this.info) return;
        
        const visiblePercent = ((this.visibleEnd - this.visibleStart) / this.data.length * 100).toFixed(1);
        this.info.textContent = `虚拟滚动: ${this.visibleStart}-${this.visibleEnd}/${this.data.length} (${visiblePercent}%)`;
    },

    handleScroll() {
        const scrollTop = this.viewport.scrollTop;
        
        // 只有滚动超过一定距离才重新渲染
        if (Math.abs(scrollTop - this.lastScrollTop) > this.rowHeight * 0.5) {
            this.lastScrollTop = scrollTop;
            this.calculateVisibleRange();
            this.renderVisibleRows();
        }
    },
    
    initColumnResize(thead) {
        const resizers = thead.querySelectorAll('.column-resizer');
        
        resizers.forEach((resizer) => {
            const th = resizer.parentElement;
            let startX, startWidth;

            const onMouseDown = (e) => {
                e.preventDefault();
                startX = e.pageX;
                startWidth = th.offsetWidth;

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
                
                resizer.classList.add('resizing');
            };

            const onMouseMove = (e) => {
                const width = startWidth + (e.pageX - startX);
                if (width > 50) {
                    // 更新表头列宽
                    th.style.width = width + 'px';
                    th.style.minWidth = width + 'px';
                    th.style.maxWidth = width + 'px';
                    
                    // 同步更新所有可见行的对应列宽
                    this.renderedRows.forEach((rowElement) => {
                        const td = rowElement.querySelector(`td:nth-child(${Array.from(thead.querySelectorAll('th')).indexOf(th) + 1})`);
                        if (td) {
                            td.style.width = width + 'px';
                            td.style.minWidth = width + 'px';
                            td.style.maxWidth = width + 'px';
                        }
                    });
                }
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                resizer.classList.remove('resizing');
            };

            resizer.addEventListener('mousedown', onMouseDown);
        });
    },

    // 清理资源
    destroy() {
        if (this.viewport) {
            this.viewport.removeEventListener('scroll', this.handleScroll);
        }
        this.renderedRows.clear();
        STATE.virtualTables.delete(this.tableId);
    }
};

// ==================== 优化表格渲染器 ====================
const OptimizedTableRenderer = {
    renderLargeTable(tableId, data, options = {}) {
        if (!data || data.length === 0) {
            console.log(`📊 ${tableId}: 无数据可渲染`);
            return;
        }
        
        const thead = document.getElementById(`${tableId}-head`);
        const tbody = document.getElementById(`${tableId}-body`);
        if (!thead || !tbody) {
            console.error(`❌ ${tableId}: 表格元素未找到`);
            return;
        }

        const blueprint = Utils.findRowWithMostKeys(data);
        const columns = Object.keys(blueprint);
        const threshold = options.virtualScrollThreshold || CONFIG.PERFORMANCE.VIRTUAL_SCROLL_THRESHOLD;
        
        // 根据数据量决定渲染策略
        if (data.length > threshold) {
            console.log(`📊 ${tableId}: 数据量过大 (${data.length}行)，启用虚拟滚动`);
            this.renderWithVirtualScroll(tableId, data, columns);
        } else {
            console.log(`📊 ${tableId}: 数据量适中 (${data.length}行)，使用普通渲染`);
            this.renderNormally(tableId, data, columns);
        }
    },

    renderWithVirtualScroll(tableId, data, columns) {
        // 确保容器存在并设置正确样式
        const scrollContainer = document.getElementById(`${tableId}-scroll`);
        if (scrollContainer) {
            scrollContainer.style.position = 'relative';
            scrollContainer.style.overflow = 'auto'; // 允许滚动
        }
        
        // 先渲染普通表格获取列宽信息
        this.renderNormallyForColumnWidths(tableId, data, columns);
        
        // 然后初始化虚拟滚动
        setTimeout(() => {
            VirtualTableRenderer.init(tableId, data, columns);
        }, 100);
    },
    
    renderNormallyForColumnWidths(tableId, data, columns) {
        const thead = document.getElementById(`${tableId}-head`);
        const tbody = document.getElementById(`${tableId}-body`);
        
        if (!thead || !tbody) return;
        
        // 只渲染表头来获取列宽信息
        thead.innerHTML = `<tr>${columns.map((col, index) => 
            `<th data-column="${col}" data-index="${index}">
                ${col}
                <span class="column-resizer"></span>
            </th>`
        ).join('')}</tr>`;
        
        // 初始化列宽调整（用于虚拟滚动参考）
        this.initColumnResize(tableId, thead);
    },

    renderNormally(tableId, data, columns) {
        const thead = document.getElementById(`${tableId}-head`);
        const tbody = document.getElementById(`${tableId}-body`);
        
        // 渲染表头
        thead.innerHTML = `<tr>${columns.map((col, index) => 
            `<th data-column="${col}" data-index="${index}">
                ${col}
                <span class="column-resizer"></span>
            </th>`
        ).join('')}</tr>`;

        // 显示渲染进度
        const totalRows = data.length;
        console.log(`⏳ 开始渲染 ${totalRows} 行数据...`);

        // 使用分批渲染避免阻塞
        const batchSize = CONFIG.PERFORMANCE.BATCH_RENDER_SIZE;
        let renderedCount = 0;

        const renderBatch = () => {
            const startTime = performance.now();
            const end = Math.min(renderedCount + batchSize, totalRows);
            const fragment = document.createDocumentFragment();
            
            for (let i = renderedCount; i < end; i++) {
                const row = data[i];
                const tr = this.createOptimizedRow(row, i, columns);
                fragment.appendChild(tr);
            }
            
            tbody.appendChild(fragment);
            renderedCount = end;
            
            const batchTime = performance.now() - startTime;
            
            if (renderedCount < totalRows) {
                // 显示进度
                const progress = ((renderedCount / totalRows) * 100).toFixed(1);
                console.log(`⏳ 渲染进度: ${renderedCount}/${totalRows} (${progress}%) - 本批耗时: ${batchTime.toFixed(1)}ms`);
                
                // 使用requestAnimationFrame继续渲染
                requestAnimationFrame(renderBatch);
            } else {
                console.log(`✓ 表格渲染完成，共 ${totalRows} 行，最后一批耗时: ${batchTime.toFixed(1)}ms`);
                
                // 初始化列宽调整
                this.initColumnResize(tableId, thead);
            }
        };

        renderBatch();
    },

	createOptimizedRow(row, index, columns) {
		const tr = document.createElement('tr');
		tr.style.borderLeft = `4px solid ${Utils.generateColor(index)}`;
		
		columns.forEach((col, colIndex) => {
			const td = document.createElement('td');
			
			const { value: rawValue } = Utils.smartGetValue(row, columns, colIndex);
			let value = rawValue ?? '';
			
			// 样式设置
			td.style.padding = '8px';
			td.style.border = 'none';
			td.style.borderBottom = '1px solid #f0f0f0';
			td.style.whiteSpace = 'nowrap';
			td.style.overflow = 'hidden';
			td.style.textOverflow = 'ellipsis';
			td.style.boxSizing = 'border-box';
			td.setAttribute('data-full-content', value || '');
			
			// 优化内容显示
			if (value && typeof value === 'string') {
				if (value.length > 100) {
					td.textContent = value.substring(0, 100) + '...';
					td.title = ''; // 清除默认title，使用自定义tooltip
					td.classList.add('truncated');
					
					// ⚠️ 长内容：悬停+点击双重支持
					td.addEventListener('mouseenter', () => {
						Utils.showSmartTooltip(td, value, 'hover');
					});
					
					td.style.cursor = 'pointer';
					td.addEventListener('click', (e) => {
						if (!e.target.classList.contains('cell-link')) {
							Utils.showSmartTooltip(td, value, 'click');
						}
					});
				} else if (value.length > 50) {
					td.textContent = value.substring(0, 50) + '...';
					td.title = ''; // 清除默认title
					td.classList.add('truncated');
					
					// ⚠️ 中等长度：只用悬停
					td.addEventListener('mouseenter', () => {
						Utils.showSmartTooltip(td, value, 'hover');
					});
				} else {
					td.textContent = value;
				}
			} else {
				td.textContent = value || '';
			}
			
			tr.appendChild(td);
		});
		
		return tr;
	},

    initColumnResize(tableId, thead) {
        const resizers = thead.querySelectorAll('.column-resizer');
        
        resizers.forEach((resizer) => {
            const th = resizer.parentElement;
            let startX, startWidth;

            const onMouseDown = (e) => {
                e.preventDefault();
                startX = e.pageX;
                startWidth = th.offsetWidth;

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
                
                resizer.classList.add('resizing');
            };

            const onMouseMove = (e) => {
                const width = startWidth + (e.pageX - startX);
                if (width > 50) {
                    th.style.width = width + 'px';
                    th.style.minWidth = width + 'px';
                    th.style.maxWidth = width + 'px';
                    
                    // 同步更新虚拟表格的列宽（如果存在）
                    const virtualTable = STATE.virtualTables.get(tableId);
                    if (virtualTable) {
                        const virtualThead = document.getElementById(`${tableId}-head-virtual`);
                        if (virtualThead) {
                            const virtualTh = virtualThead.querySelector(`th[data-index="${th.dataset.index}"]`);
                            if (virtualTh) {
                                virtualTh.style.width = width + 'px';
                                virtualTh.style.minWidth = width + 'px';
                                virtualTh.style.maxWidth = width + 'px';
                                
                                // 更新虚拟表格中所有可见行的列宽
                                virtualTable.renderedRows.forEach((rowElement) => {
                                    const td = rowElement.querySelector(`td:nth-child(${parseInt(th.dataset.index) + 1})`);
                                    if (td) {
                                        td.style.width = width + 'px';
                                        td.style.minWidth = width + 'px';
                                        td.style.maxWidth = width + 'px';
                                    }
                                });
                            }
                        }
                    }
                }
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                resizer.classList.remove('resizing');
                this.saveColumnWidths(tableId, thead);
            };

            resizer.addEventListener('mousedown', onMouseDown);
        });
    },
    
    saveColumnWidths(tableId, thead) {
        const ths = thead.querySelectorAll('th');
        const widths = Array.from(ths).map(th => ({
            column: th.dataset.column,
            width: th.offsetWidth
        }));

        const expires = new Date();
        expires.setDate(expires.getDate() + 30);
        document.cookie = `columnWidths_${tableId}=${JSON.stringify(widths)}; expires=${expires.toUTCString()}; path=/`;
        
        console.log('✓ 列宽已保存:', tableId, widths);
    }
};

// ==================== 工具函数 ====================
const Utils = {
	
    // 🆕 新增：找出数据中键最多的那一行
    findRowWithMostKeys(data) {
        if (!data || data.length === 0) return null;
        
        let longestRow = data[0];
        let maxKeys = Object.keys(longestRow).length;
        
        for (let i = 1; i < data.length; i++) {
            const keyCount = Object.keys(data[i]).length;
            if (keyCount > maxKeys) {
                maxKeys = keyCount;
                longestRow = data[i];
            }
        }
        
        console.log(`🔍 找到键最多的行 (${maxKeys}列):`, Object.keys(longestRow));
        return longestRow;
    },

    // 🆕 新增：智能取值逻辑（UNION ALL 式）
    smartGetValue(row, columns, columnIndex) {
        const column = columns[columnIndex];
        
        // 策略1: 优先按键名精确匹配
        if (row.hasOwnProperty(column)) {
            return { value: row[column], usedKey: column };
        }
        
        // 策略2: 键名不匹配时，按位置取未使用的值
        const rowKeys = Object.keys(row);
        const rowValues = Object.values(row);
        
        // 找出已经被其他列通过键名匹配占用的键
        const usedKeys = new Set();
        columns.forEach(col => {
            if (row.hasOwnProperty(col)) {
                usedKeys.add(col);
            }
        });
        
        // 找出未被占用的键（按原始顺序）
        const unusedKeys = rowKeys.filter(key => !usedKeys.has(key));
        
        // 计算当前列是第几个"未匹配"的列
        let unmatchedColumnIndex = 0;
        for (let i = 0; i < columnIndex; i++) {
            if (!row.hasOwnProperty(columns[i])) {
                unmatchedColumnIndex++;
            }
        }
        
        // 从未使用的键中，按位置取对应的值
        if (unmatchedColumnIndex < unusedKeys.length) {
            const targetKey = unusedKeys[unmatchedColumnIndex];
            return { value: row[targetKey], usedKey: targetKey };
        }
        
        // 策略3: 实在没有就留空
        return { value: '', usedKey: null };
    },
	
    formatDate(value) {
        if (value === undefined || value === null || value === '') return 'N/A';
        
        const str = String(value).trim();
        
        const dateRegex = /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/;
        if (!dateRegex.test(str)) {
            return str;
        }
        
        const d = new Date(str.includes(' ') ? str : str + ' 00:00:00');
        if (isNaN(d.getTime())) return str;
        
        return d.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).replace(/\//g, '-').replace(/年|月|日/g, '-').replace(/上午|下午/g, '');
    },

    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    showLoading(container) {
        container.innerHTML = '<div class="loading">載入中...</div>';
    },

    showError(container, message) {
        container.innerHTML = `<div class="error">${message}</div>`;
    },

    async checkFileExists(filename) {
        try {
            const response = await fetch(`${CONFIG.DOWNLOADS_DIR}/${filename}?_=${Date.now()}`, {
                method: 'HEAD'
            });
            return response.ok;
        } catch {
            return false;
        }
    },

    async readJSONFile(filename) {
        try {
            const response = await fetch(`${CONFIG.DOWNLOADS_DIR}/${filename}?_=${Date.now()}`);
            if (!response.ok) throw new Error(`文件不存在: ${filename}`);
            return await response.json();
        } catch (error) {
            console.error(`读取文件失败: ${filename}`, error);
            throw error;
        }
    },

    async triggerN8N(webhook, params = {}) {
        try {
            console.log('🚀 發送N8N請求:', webhook);
            console.log('📦 請求參數:', JSON.stringify(params, null, 2));
            
            const response = await fetch(webhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            });
            
            console.log('📡 響應狀態:', response.status, response.statusText);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ N8N響應錯誤:', errorText);
                throw new Error(`觸發失敗: ${response.status} ${errorText}`);
            }
            
            const result = await response.json();
            console.log('✓ N8N響應成功:', result);
            return result;
        } catch (error) {
            console.error('❌ 觸發N8N失敗:', error);
            console.error('錯誤詳情:', error.stack);
            throw error;
        }
    },

    generateColor(index) {
        const colors = [
            '#007a7a', '#00c4c4', '#ff6b6b', '#4ecdc4', '#45b7d1', 
            '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'
        ];
        return colors[index % colors.length];
    },

    formatFilterInfo(filters) {
        if (!filters || Object.keys(filters).length === 0) {
            return '';
        }
        
        const parts = [];
        if (filters.dateType) {
            parts.push(`${filters.dateType}`);
        }
        if (filters.startDate && filters.endDate) {
            parts.push(`${filters.startDate} ~ ${filters.endDate}`);
        }
        if (filters.aggregation) {
            const aggLabels = {
                daily: '按天',
                weekly: '按週',
                monthly: '按月',
                quarterly: '按季',
                yearly: '按年'
            };
            parts.push(aggLabels[filters.aggregation] || filters.aggregation);
        }
        if (filters.textFilterField && filters.textFilterValue) {
            parts.push(`${filters.textFilterField}: ${filters.textFilterValue}`);
        }
        
        return parts.length > 0 ? `(${parts.join(' | ')})` : '';
    },

	processCellContent(value) {
		if (!value || value === '' || value === 'N/A') return value;
		
		const str = String(value);
		const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`\[\]]+)/gi;
		
		if (urlRegex.test(str)) {
			return str.replace(urlRegex, url => {
				// 移除末尾的标点符号
				const cleanUrl = url.replace(/[.,;:!?)]+$/, '');
				const punctuation = url.slice(cleanUrl.length);
				
				// 创建可点击的链接
				return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="cell-link" onclick="event.stopPropagation()">${cleanUrl}</a>${punctuation}`;
			});
		}
		
		return str;
	},

    downloadCSV(data, filename) {
        if (!data || data.length === 0) return;

        const columns = Object.keys(data[0]);
        const csvContent = [
            columns.join(','),
            ...data.map(row => columns.map(col => `"${(row[col] || '').toString().replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

	showSmartTooltip(element, content, mode = 'click') {
		// 如果是悬停模式，先隐藏之前的tooltip
		if (mode === 'hover') {
			this.hideTooltip();
		}

		if (!content || content === '' || content === 'N/A') return;

		const tooltip = this.createInteractiveTooltip(content, element);
		document.body.appendChild(tooltip);

		this.positionTooltip(element, tooltip);
		this.currentTooltip = tooltip;

		if (mode === 'hover') {
			// 悬停模式：鼠标离开元素或tooltip时隐藏
			let hideTimer = null;
			
			const scheduleHide = () => {
				hideTimer = setTimeout(() => {
					this.hideTooltip();
				}, 200); // 200ms延迟，避免移动到tooltip时闪烁
			};
			
			const cancelHide = () => {
				if (hideTimer) {
					clearTimeout(hideTimer);
					hideTimer = null;
				}
			};

			element.addEventListener('mouseleave', scheduleHide);
			tooltip.addEventListener('mouseenter', cancelHide);
			tooltip.addEventListener('mouseleave', scheduleHide);
			
			// 存储清理函数
			tooltip._cleanupHover = () => {
				element.removeEventListener('mouseleave', scheduleHide);
				if (hideTimer) clearTimeout(hideTimer);
			};
		} else {
			// 点击模式：点击外部或ESC关闭
			setTimeout(() => {
				const clickOutside = (e) => {
					if (!tooltip.contains(e.target) && e.target !== element) {
						this.hideTooltip();
						document.removeEventListener('click', clickOutside);
					}
				};
				document.addEventListener('click', clickOutside);
			}, 100);

			const escHandler = (e) => {
				if (e.key === 'Escape') {
					this.hideTooltip();
					document.removeEventListener('keydown', escHandler);
				}
			};
			document.addEventListener('keydown', escHandler);
		}
	},

	createInteractiveTooltip(content, cellElement) {
		const processedContent = this.processCellContent(content);
		
		const tooltip = document.createElement('div');
		tooltip.className = 'interactive-tooltip';
		tooltip.innerHTML = `
			<div class="tooltip-header">
				<span class="tooltip-title">单元格内容</span>
				<button class="tooltip-close" type="button">×</button>
			</div>
			<div class="tooltip-content">${processedContent}</div>
		`;

		const closeBtn = tooltip.querySelector('.tooltip-close');
		closeBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			this.hideTooltip();
		});

		// 阻止tooltip内部点击冒泡（除了链接）
		tooltip.addEventListener('click', (e) => {
			// 如果点击的是链接，允许跳转
			if (e.target.classList.contains('cell-link')) {
				console.log('🔗 点击链接:', e.target.href);
				// 不阻止默认行为，允许链接正常跳转
				return;
			}
			e.stopPropagation();
		});

		return tooltip;
	},

	hideTooltip() {
		if (this.currentTooltip) {
			// 清理悬停模式的事件监听器
			if (this.currentTooltip._cleanupHover) {
				this.currentTooltip._cleanupHover();
			}
			this.currentTooltip.remove();
			this.currentTooltip = null;
		}
	},

    positionTooltip(element, tooltip) {
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        const padding = 10;
        let top, left;

        left = rect.right + padding;
        top = rect.top;

        if (left + tooltipRect.width > viewport.width - padding) {
            left = rect.left - tooltipRect.width - padding;
        }

        if (left < padding) {
            left = (viewport.width - tooltipRect.width) / 2;
        }

        if (top + tooltipRect.height > viewport.height - padding) {
            top = viewport.height - tooltipRect.height - padding;
        }

        if (top < padding) {
            top = padding;
        }

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
    }
};

// ==================== 数据加载管理器 ====================
const DataLoader = {
    async loadData(tabId, forceRefresh = false) {
        // 使用动态生成的文件名
        const filename = FileNameManager.getFileName(tabId);
        const webhook = CONFIG.N8N_WEBHOOKS[tabId];

        console.log('=== 開始加載數據 ===');
        console.log('Tab ID:', tabId);
        console.log('文件名:', filename);
        console.log('Webhook:', webhook);
        console.log('用戶:', STATE.userInfo.userId);

        if (!filename || !webhook) {
            console.error('❌ 未配置的Tab:', tabId);
            return null;
        }

        try {
            const fileExists = await Utils.checkFileExists(filename);
            console.log('文件存在檢查:', fileExists);

            if (!fileExists || forceRefresh) {
                console.log('📡 觸發N8N生成數據...');
                
                const filters = this.getFilters(tabId);
                
                // 添加用户信息到筛选条件，N8N可以用这个来生成正确的文件名
                filters.userId = STATE.userInfo.userId || 'anonymous';
                filters.userName = STATE.userInfo.userName || 'unknown';
                filters.requestedFileName = filename; // 告诉N8N要生成的文件名
                
                console.log('篩選條件:', filters);
                
                const triggerResult = await Utils.triggerN8N(webhook, filters);
                console.log('N8N觸發結果:', triggerResult);
                
                console.log('⏳ 等待文件生成...');
                await this.waitForFile(filename, 10000);
                console.log('✓ 文件已生成');
            } else {
                console.log('✓ 使用現有文件');
            }

            console.log('📖 讀取JSON文件...');
            const data = await Utils.readJSONFile(filename);
            console.log('✓ 數據加載成功');
            
            return data;

        } catch (error) {
            console.error('❌ 加載數據失敗:', error);
            throw error;
        }
    },

    async waitForFile(filename, timeout = 15000) {
        const startTime = Date.now();
        const checkInterval = 500;

        console.log(`⏳ 等待文件生成: ${filename}`);

        while (Date.now() - startTime < timeout) {
            const exists = await Utils.checkFileExists(filename);
            if (exists) {
                console.log(`✓ 文件已生成 (耗时: ${Date.now() - startTime}ms)`);
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, checkInterval));
        }

        console.error(`❌ 等待文件超时: ${filename} (超过${timeout}ms)`);
        throw new Error(`等待文件超时: ${filename}`);
    },

    // 修改 getFilters 方法，确保包含会话信息
    getFilters(tabId) {
        const filters = STATE.filters[tabId] || {};
        
        if (!filters.startDate || !filters.endDate) {
            const today = new Date();
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            
            const defaultDateType = this.getDefaultDateType(tabId);
            
            return {
                dateType: defaultDateType,
                startDate: firstDay.toISOString().split('T')[0],
                endDate: lastDay.toISOString().split('T')[0],
                aggregation: 'monthly',
                ...filters
            };
        }

        // 添加字符筛选的安全处理标记
        if (filters.textFilterField && filters.textFilterValue) {
            filters.hasTextFilter = true;
            filters.textFilterSafe = true;
        }

        return filters;
    },

    getDefaultDateType(tabId) {
        const defaults = {
            purchase: '交货日期',
            sales: '要货日期',
            production: '下达日期',
            milestone: '要货日期',
            inventory: '更新日期',
            calendar: '開始日期',
            hr: '發佈日期',
            dept: '發佈日期'
        };
        return defaults[tabId] || '';
    }
};

// ==================== 内存管理器 ====================
const MemoryManager = {
    clearUnusedData() {
        // 清理不再使用的虚拟表格
        STATE.virtualTables.forEach((table, tableId) => {
            if (!document.getElementById(`${tableId}-scroll`)) {
                table.destroy();
                console.log(`🧹 清理虚拟表格: ${tableId}`);
            }
        });
        
        // 清理不再使用的图表
        STATE.charts.forEach((chart, id) => {
            if (!document.getElementById(id)) {
                chart.dispose();
                STATE.charts.delete(id);
                console.log(`🧹 清理图表: ${id}`);
            }
        });
        
        // 强制垃圾回收（在支持的环境中）
        if (window.gc) {
            window.gc();
        }
        
        console.log('🧹 内存清理完成');
    }
};

// ==================== 渲染管理器 ====================
const Renderer = {
    async renderTab(tabId, forceRefresh = false) {
        console.log('=== 渲染Tab ===');
        console.log('Tab ID:', tabId);
        console.log('強制刷新:', forceRefresh);
        
        // 清理前一个tab的资源
        MemoryManager.clearUnusedData();
        
        if (tabId === 'overview') {
            await this.renderOverview();
            return;
        }

        const tabContent = document.getElementById(`${tabId}-tab`);
        if (!tabContent) {
            console.error('❌ Tab不存在:', tabId);
            return;
        }

        try {
            Utils.showLoading(tabContent);
            const data = await DataLoader.loadData(tabId, forceRefresh);

            if (!data) {
                Utils.showError(tabContent, '無法載入數據');
                return;
            }

            this.renderDynamicContent(tabContent, data, tabId);
            console.log('✓ 渲染完成');

        } catch (error) {
            console.error(`❌ 渲染Tab失敗: ${tabId}`, error);
            Utils.showError(tabContent, `載入失敗: ${error.message}`);
        }
    },

    async renderOverview() {
        const iframe = document.getElementById('metabase-iframe');
        
        try {
            console.log('🎯 加載Metabase儀表板...');
            const response = await fetch(CONFIG.METABASE_API);
            const data = await response.json();

            if (data.success && data.iframeUrl) {
                iframe.src = data.iframeUrl;
                iframe.onload = () => {
                    console.log('✓ Metabase儀表板加載完成');
                    this.hideMetabaseFooter(iframe);
                    
                    // 为Metabase iframe添加滚动支持
                    this.initMetabaseScrolling(iframe);
                };
            } else {
                throw new Error(data.error || '無法載入儀表板');
            }
        } catch (error) {
            console.error('❌ 加載Metabase失敗:', error);
            iframe.srcdoc = `
                <div style="display:flex;align-items:center;justify-content:center;height:100%;text-align:center;color:#666;">
                    <div>
                        <h3>儀表板載入失敗</h3>
                        <p>${error.message}</p>
                    </div>
                </div>
            `;
        }
    },

    openChartDesigner(tabId) {
        const modal = document.getElementById('chart-designer-modal');
        const tabName = document.querySelector(`[data-tab="${tabId}"]`)?.textContent || tabId;
        document.getElementById('designer-tab-name').textContent = tabName;

        // 使用动态文件名
        const filename = FileNameManager.getFileName(tabId);
        
        Utils.readJSONFile(filename).then(data => {
            const detail = data.detail || [];
            if (detail.length === 0) {
                alert('暂无明细数据，无法设计图表');
                return;
            }

            STATE.chartDesignerData = detail;
            STATE.chartDesignerSchema = Object.keys(detail[0]);
            this.renderChartList();
            modal.style.display = 'flex';
        }).catch(err => {
            alert('无法加载数据：' + err.message);
        });
    },
    
    // 初始化Metabase iframe滚动支持
    initMetabaseScrolling(iframe) {
        try {
            // 确保iframe容器可以滚动
            const container = iframe.parentElement;
            if (container) {
                container.style.overflow = 'auto';
                container.style.position = 'relative';
                
                // 移除之前可能设置的负边距
                container.style.marginBottom = '0';
                
                console.log('✓ Metabase滚动支持已初始化');
            }
        } catch (error) {
            console.log('⚠️ Metabase滚动初始化失败:', error);
        }
    },

    hideMetabaseFooter(iframe) {
        try {
            const style = document.createElement('style');
            style.textContent = `
                footer[data-testid="embed-frame-footer"] {
                    display: none !important;
                }
            `;
            
            if (iframe.contentDocument) {
                iframe.contentDocument.head.appendChild(style);
                console.log('✓ Metabase footer已隱藏');
            } else {
                // 如果无法直接操作iframe内容，使用容器样式
                const container = iframe.parentElement;
                container.style.overflow = 'auto';
                console.log('✓ 使用容器樣式處理Metabase顯示');
            }
        } catch (error) {
            console.log('⚠️ 無法直接隱藏footer(跨域限制),使用容器處理');
            const container = iframe.parentElement;
            container.style.overflow = 'auto';
        }
    },

    renderDynamicContent(container, data, tabId) {
        console.log('=== 渲染動態內容 ===');
        console.log('Tab ID:', tabId);
        console.log('數據量:', {
            summary: data.summary ? (Array.isArray(data.summary) ? data.summary.length : Object.keys(data.summary).length) : 0,
            detail: data.detail ? data.detail.length : 0
        });
        
        const filters = DataLoader.getFilters(tabId);
        const filterInfo = Utils.formatFilterInfo(filters);
        
        container.innerHTML = `
            <div class="top-row">
                <div class="summary-section panel-bg">
                    <div class="panel-header" id="${tabId}-summary-header">
                        <h2>匯總數據</h2>
                        ${filterInfo ? `<span class="filter-info">${filterInfo}</span>` : ''}
                        <button class="save-btn" id="${tabId}-summary-save" style="display:none;" title="下載CSV">💾</button>
                    </div>
                    <div class="scroll-container" id="${tabId}-summary-scroll">
                        <table class="summary-table">
                            <thead id="${tabId}-summary-head"></thead>
                            <tbody id="${tabId}-summary-body"></tbody>
                        </table>
                    </div>
                </div>
                <div class="chart-section panel-bg">
                    <div class="panel-header" id="${tabId}-chart-header">
                        <h2>數據圖表</h2>
                        <button class="design-btn" id="${tabId}-chart-design" style="display:none;" title="圖表設計">📊</button>
                        <button class="save-btn" id="${tabId}-chart-save" style="display:none;" title="下載CSV">💾</button>
                    </div>
                    <div class="chart-container">
                        <canvas id="${tabId}-chart"></canvas>
                    </div>
                </div>
            </div>
            <div class="detail-section panel-bg">
                <div class="panel-header" id="${tabId}-detail-header">
                    <h2>明細數據</h2>
                    <button class="save-btn" id="${tabId}-detail-save" style="display:none;" title="下載CSV">💾</button>
                </div>
                <div class="scroll-container" id="${tabId}-detail-scroll">
                    <table class="detail-table">
                        <thead id="${tabId}-detail-head"></thead>
                        <tbody id="${tabId}-detail-body"></tbody>
                    </table>
                </div>
            </div>
        `;

        // 汇总数据渲染（通常数据量不大）
        if (data.summary) {
            if (Array.isArray(data.summary)) {
                console.log('✓ 渲染傳統格式匯總表格');
                OptimizedTableRenderer.renderLargeTable(`${tabId}-summary`, data.summary, {
                    virtualScrollThreshold: 10000 // 汇总数据阈值较低
                });
            } else {
                console.log('✓ 渲染多數據源匯總表格');
                this.renderMultiSourceSummary(`${tabId}-summary`, data.summary);
            }
        }

        // 图表渲染
        if (data.chart) {
            console.log('✓ 渲染圖表');
            this.renderChart(`${tabId}-chart`, data.chart, data.summary);
        }

        // 明细数据渲染 - 使用优化版本
        if (data.detail && data.detail.length > 0) {
            console.log(`📊 渲染明細表格，共 ${data.detail.length} 行`);
            OptimizedTableRenderer.renderLargeTable(`${tabId}-detail`, data.detail, {
                virtualScrollThreshold: CONFIG.PERFORMANCE.VIRTUAL_SCROLL_THRESHOLD
            });
        }

        // 初始化滚动（虚拟滚动会自己处理，只对普通表格生效）
        if (data.detail && data.detail.length <= CONFIG.PERFORMANCE.VIRTUAL_SCROLL_THRESHOLD) {
            this.initScroll(`${tabId}-summary-scroll`);
            this.initScroll(`${tabId}-detail-scroll`);
        }

        this.initSaveButtons(tabId, data);
		//图表设计
		this.initChartDesignerButton(tabId);
    },

	initChartDesignerButton(tabId) {
	  const designBtn = document.getElementById(`${tabId}-chart-design`);
	  if (designBtn) {
		designBtn.onclick = () => openChartDesigner();
	  }
	},

    initSaveButtons(tabId, data) {
        const sections = [
            { id: 'summary', data: data.summary },
            { id: 'chart', data: data.chart },
            { id: 'detail', data: data.detail }
        ];

        sections.forEach(section => {
            const header = document.getElementById(`${tabId}-${section.id}-header`);
            const saveBtn = document.getElementById(`${tabId}-${section.id}-save`);

            if (header && saveBtn && section.data) {
                header.addEventListener('mouseenter', () => {
                    saveBtn.style.display = 'inline-block';
                });
                header.addEventListener('mouseleave', () => {
                    saveBtn.style.display = 'none';
                });

                saveBtn.addEventListener('click', () => {
                    let exportData = section.data;
                    if (!Array.isArray(exportData)) {
                        exportData = Object.values(exportData).flat();
                    }
                    Utils.downloadCSV(exportData, `${tabId}-${section.id}.csv`);
                });
            }
        });
    },

    renderMultiSourceSummary(tableId, summaryData) {
        const thead = document.getElementById(`${tableId}-head`);
        const tbody = document.getElementById(`${tableId}-body`);

        if (!thead || !tbody) return;

        const allColumns = new Set(['数据源']);
        Object.values(summaryData).forEach(dataArray => {
            dataArray.forEach(record => {
                Object.keys(record).forEach(key => allColumns.add(key));
            });
        });

        const columns = Array.from(allColumns);
        
        thead.innerHTML = `<tr>${columns.map((col, index) => 
            `<th data-column="${col}" data-index="${index}">
                ${col}
                <span class="column-resizer"></span>
            </th>`
        ).join('')}</tr>`;

        let rowIndex = 0;
        tbody.innerHTML = '';
        
        Object.entries(summaryData).forEach(([dataSource, records]) => {
            const color = Utils.generateColor(rowIndex);
            
            records.forEach(record => {
                const row = document.createElement('tr');
                row.style.borderLeft = '4px solid ' + color;
                
                columns.forEach(col => {
                    const cell = document.createElement('td');
                    let value = col === '数据源' ? dataSource : record[col] || '';
                    if (col.includes('日期') || col.includes('时间') || col === '日期' || col === '发佈日期') {
                        value = Utils.formatDate(value);
                    }
                    
                    const hasUrl = value && /(https?:\/\/[^\s]+)/i.test(String(value));
                    const processedValue = hasUrl ? Utils.processCellContent(value) : value;
                    
                    cell.innerHTML = processedValue || '&nbsp;';
                    cell.setAttribute('data-full-content', value || '');
                    
                    cell.addEventListener('click', (e) => {
                        if (e.target.classList.contains('cell-link')) {
                            return;
                        }
                        
                        const fullContent = cell.getAttribute('data-full-content');
                        if (fullContent && fullContent !== '') {
                            Utils.showSmartTooltip(cell, fullContent);
                        }
                    });
                    
                    if (!hasUrl && typeof value === 'string' && value.length > 20) {
                        cell.classList.add('truncated');
                    }
                    row.appendChild(cell);
                });
                
                tbody.appendChild(row);
                rowIndex++;
            });
        });

        this.initColumnResize(tableId, thead);
        this.initAutoFitColumns(tableId, thead);
        this.loadColumnWidths(tableId, thead);
    },

    renderTable(tableId, data) {
        if (!data || data.length === 0) return;
        const thead = document.getElementById(`${tableId}-head`);
        const tbody = document.getElementById(`${tableId}-body`);
        if (!thead || !tbody) return;

        const blueprint = Utils.findRowWithMostKeys(data);
        const columns = Object.keys(blueprint);

        thead.innerHTML = `<tr>${columns.map((col, index) =>
            `<th data-column="${col}" data-index="${index}">
                ${col}
                <span class="column-resizer"></span>
            </th>`
        ).join('')}</tr>`;

        tbody.innerHTML = data.map((row, rowIndex) => {
            const color = Utils.generateColor(rowIndex);
            const rowValues = Object.values(row);
            
            return `<tr style="border-left: 4px solid ${color}">${columns.map((col, colIndex) => {
                let rawValue = row[col] ?? rowValues[colIndex];
                let displayValue = (rawValue === undefined || rawValue === null || rawValue === '') ? '' : String(rawValue);
                
                const hasUrl = displayValue && /(https?:\/\/[^\s]+)/i.test(displayValue);
                
                const processedValue = hasUrl ? Utils.processCellContent(displayValue) : displayValue;
                
                const cellClass = (!hasUrl && displayValue && displayValue.length > 20) ? 'class="truncated"' : '';
                
                return `<td ${cellClass} data-full-content="${displayValue || ''}">${processedValue || '&nbsp;'}</td>`;
            }).join('')}</tr>`;
        }).join('');

        tbody.querySelectorAll('td').forEach(td => {
            td.addEventListener('click', (e) => {
                if (e.target.classList.contains('cell-link')) {
                    return;
                }
                
                const fullContent = td.getAttribute('data-full-content');
                if (fullContent && fullContent !== '') {
                    Utils.showSmartTooltip(td, fullContent);
                }
            });
        });

        this.initColumnResize(tableId, thead);
        this.initAutoFitColumns(tableId, thead);
        this.loadColumnWidths(tableId, thead);
    },

    initAutoFitColumns(tableId, thead) {
        thead.addEventListener('dblclick', () => {
            const table = thead.closest('table');
            const ths = thead.querySelectorAll('th');
            const tbody = table.querySelector('tbody');
            const rows = tbody.querySelectorAll('tr');
            const maxScreenWidth = window.innerWidth * 0.9;

            let totalWidth = 0;
            ths.forEach(th => {
                let maxWidth = th.textContent.length * 10;
                rows.forEach(row => {
                    const td = row.querySelector(`td:nth-child(${parseInt(th.dataset.index) + 1})`);
                    if (td) {
                        const tempSpan = document.createElement('span');
                        tempSpan.style.visibility = 'hidden';
                        tempSpan.style.whiteSpace = 'nowrap';
                        tempSpan.textContent = td.textContent;
                        document.body.appendChild(tempSpan);
                        maxWidth = Math.max(maxWidth, tempSpan.offsetWidth + 20);
                        document.body.removeChild(tempSpan);
                    }
                });
                th.style.width = `${maxWidth}px`;
                th.style.minWidth = `${maxWidth}px`;
                th.style.maxWidth = `${maxWidth}px`;
                totalWidth += maxWidth;
            });

            if (totalWidth > maxScreenWidth) {
                const scale = maxScreenWidth / totalWidth;
                ths.forEach(th => {
                    const currentWidth = parseFloat(th.style.width);
                    th.style.width = `${currentWidth * scale}px`;
                    th.style.minWidth = `${currentWidth * scale}px`;
                    th.style.maxWidth = `${currentWidth * scale}px`;
                });
            }

            this.saveColumnWidths(tableId, thead);
        });
    },

    initColumnResize(tableId, thead) {
        const resizers = thead.querySelectorAll('.column-resizer');
        
        resizers.forEach((resizer) => {
            const th = resizer.parentElement;
            let startX, startWidth;

            const onMouseDown = (e) => {
                e.preventDefault();
                startX = e.pageX;
                startWidth = th.offsetWidth;

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
                
                resizer.classList.add('resizing');
            };

            const onMouseMove = (e) => {
                const width = startWidth + (e.pageX - startX);
                if (width > 50) {
                    th.style.width = width + 'px';
                    th.style.minWidth = width + 'px';
                    th.style.maxWidth = width + 'px';
                }
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                resizer.classList.remove('resizing');
                this.saveColumnWidths(tableId, thead);
            };

            resizer.addEventListener('mousedown', onMouseDown);
        });
    },

    saveColumnWidths(tableId, thead) {
        const ths = thead.querySelectorAll('th');
        const widths = Array.from(ths).map(th => ({
            column: th.dataset.column,
            width: th.offsetWidth
        }));

        const expires = new Date();
        expires.setDate(expires.getDate() + 30);
        document.cookie = `columnWidths_${tableId}=${JSON.stringify(widths)}; expires=${expires.toUTCString()}; path=/`;
        
        console.log('✓ 列宽已保存:', tableId, widths);
    },

    loadColumnWidths(tableId, thead) {
        const cookie = document.cookie
            .split('; ')
            .find(row => row.startsWith(`columnWidths_${tableId}=`));

        if (!cookie) return;

        try {
            const widths = JSON.parse(cookie.split('=')[1]);
            const ths = thead.querySelectorAll('th');

            widths.forEach(({ column, width }) => {
                const th = Array.from(ths).find(t => t.dataset.column === column);
                if (th && width) {
                    th.style.width = width + 'px';
                    th.style.minWidth = width + 'px';
                    th.style.maxWidth = width + 'px';
                }
            });

            console.log('✓ 列宽已恢复:', tableId, widths);
        } catch (error) {
            console.error('恢复列宽失败:', error);
        }
    },

    renderChart(canvasId, chartConfig, summaryData) {
        if (!chartConfig) return;

        const chartContainer = document.getElementById(canvasId)?.parentElement;
        if (!chartContainer) return;

        let charts = Array.isArray(chartConfig) ? chartConfig : [chartConfig];
        
        charts = charts.sort((a, b) => {
            const orderA = a.order !== undefined ? a.order : 999;
            const orderB = b.order !== undefined ? b.order : 999;
            return orderA - orderB;
        });
        
        console.log(`📊 渲染 ${charts.length} 個圖表`);

        chartContainer.innerHTML = '';

        const chartClass = charts.length === 1 ? 'single-chart' : 
                          charts.length === 2 ? 'dual-chart' : 
                          'multi-chart';
        
        chartContainer.className = `chart-container ${chartClass}`;

        charts.forEach((config, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'chart-wrapper';
            
            const chartDiv = document.createElement('div');
            chartDiv.id = `${canvasId}-${index}`;
            chartDiv.className = 'echart-container';
            wrapper.appendChild(chartDiv);
            chartContainer.appendChild(wrapper);

            let chartData = this.getFilteredData(config, summaryData);
            console.log(`📈 圖表 ${index + 1} 數據:`, chartData);

            this.createEChart(chartDiv, config, chartData);
        });
    },

    getFilteredData(config, summaryData) {
        let data = [];
        
        if (config.dataSource && summaryData && !Array.isArray(summaryData)) {
            data = summaryData[config.dataSource] || [];
        } 
        else if (Array.isArray(summaryData)) {
            data = summaryData.filter(item => {
                if (!config.filter) return true;
                
                return Object.entries(config.filter).every(([key, value]) => {
                    return item[key] === value;
                });
            });
        }
        
        console.log(`🔍 數據過濾: filter=${JSON.stringify(config.filter)}, 結果=${data.length}條`);
        return data;
    },

    createEChart(container, config, data) {
        console.log('=== 創建EChart ===');
        console.log('配置:', config);
       
        const beautifulThemes = [
            'macarons', 'infographic', 'shine', 'roma', 'vintage',
            'purple-passion', 'walden', 'westeros', 'wonderland',
            'chalk', 'halloween', 'dark', 'vintage', 'essos'
        ];

        let theme = config.theme || STATE.theme.chartTheme || 'default';
        if (theme === 'auto') {
            const index = Math.floor(Math.random() * beautifulThemes.length);
            theme = beautifulThemes[index];
            console.log(`🎨 自動選用絢麗主題: ${theme}`);
        }

        const chart = echarts.init(container, theme);
        
        const chartData = this.prepareChartData(config, data);
        console.log('處理後的數據:', chartData);

        const option = this.getEChartOption(config, chartData);
        chart.setOption(option);
        
        STATE.charts.set(container.id, chart);
        
        window.addEventListener('resize', () => {
            chart.resize();
        });
        
        console.log(`✓ EChart創建成功: ${config.title || config.type}, 主題: ${theme}`);
    },

	prepareChartData(config, data) {
		console.log('準備圖表數據:', { config, dataLength: data.length });
		
		if (!data || data.length === 0) {
			console.warn('⚠️ 無數據可用於圖表:', config.title);
			return {
				labels: ['無數據'],
				values: [1],
				seriesData: [{ name: '無數據', value: 1 }],
				series: []
			};
		}

		// 处理多系列数据
		if (config.seriesColumn) {
			return this.prepareMultiSeriesData(config, data);
		} 
		// 处理单系列数据
		else {
			return this.prepareSingleSeriesData(config, data);
		}
	},

	prepareMultiSeriesData(config, data) {
		const seriesMap = new Map();
		const allLabels = new Set();
		
		// 按系列分组数据，并收集所有标签
		data.forEach(item => {
			const seriesName = item[config.seriesColumn] || '未分類';
			const label = item[config.labelColumn] || '未知';
			const value = parseFloat(item[config.dataColumn]) || 0;
			
			allLabels.add(label);
			
			if (!seriesMap.has(seriesName)) {
				seriesMap.set(seriesName, new Map());
			}
			
			seriesMap.get(seriesName).set(label, value);
		});
		
		// 排序标签
		const labels = Array.from(allLabels).sort();
		
		// 构建系列数据
		const series = [];
		seriesMap.forEach((labelMap, seriesName) => {
			const seriesData = labels.map(label => labelMap.get(label) || 0);
			series.push({
				name: seriesName,
				data: seriesData
			});
		});
		
		return {
			labels: labels,
			values: [], // 多系列时values不再使用
			seriesData: [], // 多系列时seriesData不再使用
			series: series
		};
	},

	prepareSingleSeriesData(config, data) {
		const labels = data.map(item => {
			const value = item[config.labelColumn];
			return value !== undefined && value !== null ? String(value) : '未知';
		});
		
		const values = data.map(item => {
			const val = item[config.dataColumn];
			const numVal = parseFloat(val);
			return isNaN(numVal) ? 0 : numVal;
		});

		return {
			labels: labels,
			values: values,
			seriesData: values.map((val, idx) => ({
				name: labels[idx],
				value: val
			})),
			series: [] // 单系列时series为空
		};
	},

	getEChartOption(config, chartData) {
		const isDark = STATE.theme.dark;
		const textColor = isDark ? '#e0e0e0' : '#333';
		const bgColor = 'transparent';
		const baseOption = {
			backgroundColor: bgColor,
			title: {
				text: config.title || '',
				left: 'center',
				top: 10,
				textStyle: {
					color: textColor,
					fontSize: 16,
					fontWeight: 600
				}
			},
			tooltip: {
				trigger: 'item',
				backgroundColor: isDark ? 'rgba(50, 50, 50, 0.9)' : 'rgba(255, 255, 255, 0.9)',
				borderColor: '#ccc',
				borderWidth: 1,
				textStyle: {
					color: textColor
				}
			},
			legend: {
				show: chartData.series.length > 0,
				top: 'bottom',
				left: 'center',
				orient: 'horizontal',
				itemWidth: 10,
				itemHeight: 10,
				textStyle: {
					color: textColor,
					fontSize: 12
				},
				type: 'scroll',
				pageIconColor: textColor,
				pageTextStyle: {
					color: textColor
				}
			}
		};
		// 通用网格配置
		const gridConfig = {
			left: '3%',
			right: '4%',
			bottom: chartData.series.length > 0 ? '20%' : '15%',
			top: '15%',
			containLabel: true
		};
		// 通用坐标轴配置
		const axisConfig = {
			xAxis: {
				type: 'category',
				data: chartData.labels,
				axisLabel: {
					color: textColor,
					rotate: chartData.labels.length > 5 ? 45 : 0,
					interval: 0
				},
				axisLine: {
					lineStyle: {
						color: textColor
					}
				}
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					color: textColor
				},
				axisLine: {
					lineStyle: {
						color: textColor
					}
				},
				splitLine: {
					lineStyle: {
						color: isDark ? '#444' : '#e0e0e0'
					}
				}
			}
		};
		// 基础系列配置生成器
		const createSeries = (type, configOverride = {}) => {
			if (chartData.series.length > 0) {
				return chartData.series.map(series => ({
					name: series.name,
					type: type,
					data: series.data,
					...configOverride
				}));
			} else {
				return [{
					type: type,
					data: chartData.values,
					...configOverride
				}];
			}
		};
		switch (config.type) {
			case 'pie':
				if (chartData.series.length > 0) {
					// 多系列饼图 - 使用圆环图形式展示
					const series = chartData.series.map((series, index) => {
						const radius = [`${30 + index * 15}%`, `${40 + index * 15}%`];
						return {
							name: series.name,
							type: 'pie',
							radius: radius,
							center: ['50%', '55%'],
							avoidLabelOverlap: true,
							itemStyle: {
								borderRadius: 10,
								borderColor: bgColor,
								borderWidth: 2
							},
							label: {
								show: true,
								color: textColor,
								formatter: '{b}: {c} ({d}%)',
								position: 'outside',
								distance: 10
							},
							labelLine: {
								show: true,
								length: 20,
								length2: 10
							},
							emphasis: {
								label: {
									show: true,
									fontSize: 14,
									fontWeight: 'bold'
								},
								itemStyle: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							},
							data: series.data.map((value, idx) => ({
								name: chartData.labels[idx],
								value: value
							}))
						};
					});
					return { ...baseOption,
						tooltip: { ...baseOption.tooltip,
							formatter: '{a} <br/>{b}: {c} ({d}%)'
						},
						series: series
					};
				} else {
					// 单系列饼图
					return { ...baseOption,
						tooltip: { ...baseOption.tooltip,
							formatter: '{b}: {c} ({d}%)'
						},
						series: [{
							type: 'pie',
							radius: ['40%', '70%'],
							center: ['50%', '55%'],
							avoidLabelOverlap: true,
							itemStyle: {
								borderRadius: 10,
								borderColor: bgColor,
								borderWidth: 2
							},
							label: {
								show: true,
								color: textColor,
								formatter: '{b}: {d}%',
								position: 'outside',
								distance: 10
								},
							labelLine: {
								show: true,
								length: 20,
								length2: 10
							},
							emphasis: {
								label: {
									show: true,
									fontSize: 14,
									fontWeight: 'bold'
								},
								itemStyle: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							},
							data: chartData.seriesData
						}]
					};
				}
			case 'bar':
				const barSeries = createSeries('bar', {
					barWidth: '60%',
					itemStyle: {
						borderRadius: [5, 5, 0, 0]
					},
					label: {
						show: true,
						position: 'top',
						color: textColor,
						fontSize: 10
					}
				});
				return { ...baseOption,
					grid: gridConfig,
					...axisConfig,
					series: barSeries
				};
			case 'line':
				const lineSeries = createSeries('line', {
					smooth: config.smooth !== false,
					symbol: 'circle',
					symbolSize: 8,
					lineStyle: {
						width: 3
					},
					areaStyle: config.area ? {
						opacity: 0.3
					} : null,
					label: {
						show: true,
						position: 'top',
						distance: 10,
						color: textColor,
						fontSize: 10,
						formatter: '{c}'
					}
				});
				return { ...baseOption,
					grid: gridConfig,
					...axisConfig,
					series: lineSeries
				};
			case 'scatter':
				if (chartData.series.length > 0) {
					// 多系列散点图
					const scatterSeries = chartData.series.map(series => ({
						name: series.name,
						type: 'scatter',
						data: series.data.map((value, idx) => [chartData.labels[idx], value]),
						symbolSize: 20,
						itemStyle: {
							opacity: 0.8
						},
						label: {
							show: true,
							position: 'top',
							color: textColor
						},
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}));
					return { ...baseOption,
						grid: gridConfig,
						...axisConfig,
						series: scatterSeries
					};
				} else {
					// 单系列散点图
					return { ...baseOption,
						grid: gridConfig,
						...axisConfig,
						series: [{
							type: 'scatter',
							data: chartData.seriesData.map(item => [item.name, item.value]),
							symbolSize: 20,
							itemStyle: {
								opacity: 0.8
							},
							label: {
								show: true,
								position: 'top',
								color: textColor
							},
							emphasis: {
								itemStyle: {
									shadowBlur: 10,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							}
						}]
					};
				}
			case 'radar':
				if (chartData.series.length > 0) {
					// 多系列雷达图
					const radarSeries = chartData.series.map(series => ({
						name: series.name,
						type: 'radar',
						data: [{
							value: series.data,
							name: series.name,
							areaStyle: {
								opacity: 0.3
							}
						}]
					}));
					return { ...baseOption,
						radar: {
							indicator: chartData.labels.map(label => ({
								name: label
							})),
							shape: 'polygon',
							splitNumber: 5,
							axisName: {
								color: textColor
							},
							splitLine: {
								lineStyle: {
									color: isDark ? '#444' : '#e0e0e0'
								}
							},
							splitArea: {
								show: true,
								areaStyle: {
									color: isDark ? ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)'] : ['rgba(0, 0, 0, 0.05)', 'rgba(0, 0, 0, 0.02)']
								}
							}
						},
						series: radarSeries
					};
				} else {
					// 单系列雷达图
					return { ...baseOption,
						radar: {
							indicator: chartData.labels.map(label => ({
								name: label
							})),
							shape: 'polygon',
							splitNumber: 5,
							axisName: {
								color: textColor
							},
							splitLine: {
								lineStyle: {
									color: isDark ? '#444' : '#e0e0e0'
								}
							},
							splitArea: {
								show: true,
								areaStyle: {
									color: isDark ? ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)'] : ['rgba(0, 0, 0, 0.05)', 'rgba(0, 0, 0, 0.02)']
								}
							}
						},
						series: [{
							type: 'radar',
							data: [{
								value: chartData.values,
								name: config.title || '数据',
								areaStyle: {
									opacity: 0.3
								}
							}]
						}]
					};
				}
			case 'funnel':
				if (chartData.series.length > 0) {
					// 多系列漏斗图 - 使用平行排列
					const funnelSeries = chartData.series.map((series, index) => {
						const offset = (index - (chartData.series.length - 1) / 2) * 0.3;
						return {
							name: series.name,
							type: 'funnel',
							left: `${30 + offset * 100}%`,
							top: 60,
							bottom: 60,
							width: '40%',
							min: 0,
							max: Math.max(...series.data),
							minSize: '0%',
							maxSize: '100%',
							sort: 'descending',
							gap: 2,
							label: {
								show: true,
								position: 'inside',
								color: 'white'
							},
							labelLine: {
								length: 10,
								lineStyle: {
									width: 1,
									type: 'solid'
								}
							},
							itemStyle: {
								borderColor: bgColor,
								borderWidth: 1
							},
							emphasis: {
								label: {
									fontSize: 20
								}
							},
							data: series.data.map((value, idx) => ({
								name: chartData.labels[idx],
								value: value
							})).sort((a, b) => b.value - a.value)
						};
					});
					return { ...baseOption,
						series: funnelSeries
					};
				} else {
					// 单系列漏斗图
					return { ...baseOption,
						series: [{
							type: 'funnel',
							left: '10%',
							top: 60,
							bottom: 60,
							width: '80%',
							min: 0,
							max: Math.max(...chartData.values),
							minSize: '0%',
							maxSize: '100%',
							sort: 'descending',
							gap: 2,
							label: {
								show: true,
								position: 'inside',
								color: 'white'
							},
							labelLine: {
								length: 10,
								lineStyle: {
									width: 1,
									type: 'solid'
								}
							},
							itemStyle: {
								borderColor: bgColor,
								borderWidth: 1
							},
							emphasis: {
								label: {
									fontSize: 20
								}
							},
							data: chartData.seriesData.sort((a, b) => b.value - a.value)
						}]
					};
				}
			case 'gauge':
				// 仪表盘通常不支持多系列，显示第一个系列或第一个数据点
				const gaugeValue = chartData.series.length > 0 ? chartData.series[0].data[0] || 0 : chartData.values[0] || 0;
				const gaugeName = chartData.series.length > 0 ? chartData.series[0].name : chartData.labels[0] || '';
				return { ...baseOption,
					series: [{
						type: 'gauge',
						startAngle: 180,
						endAngle: 0,
						min: 0,
						max: config.max || 100,
						splitNumber: 8,
						axisLine: {
							lineStyle: {
								width: 6,
								color: [
									[0.3, '#67e0e3'],
									[0.7, '#37a2da'],
									[1, '#fd666d']
								]
							}
						},
						pointer: {
							itemStyle: {
								color: 'auto'
							}
						},
						axisTick: {
							distance: -30,
							length: 8,
							lineStyle: {
								color: '#fff',
								width: 2
							}
						},
						splitLine: {
							distance: -30,
							length: 30,
							lineStyle: {
								color: '#fff',
								width: 4
							}
						},
						axisLabel: {
							color: textColor,
							distance: 40,
							fontSize: 12
						},
						detail: {
							valueAnimation: true,
							formatter: '{value}',
							color: textColor,
							fontSize: 30
						},
						data: [{
							value: gaugeValue,
							name: gaugeName
						}]
					}]
					};
			case 'heatmap':
				if (chartData.series.length > 0) {
					// 多系列热力图 - 使用多个热力图
					const heatmapSeries = chartData.series.map((series, index) => ({
						name: series.name,
						type: 'heatmap',
						data: series.data.map((value, idx) => [idx, index, value]),
						label: {
							show: true
						},
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}));
					return { ...baseOption,
						tooltip: {
							position: 'top',
							formatter: function(params) {
								return `${params.seriesName}<br/>${chartData.labels[params.data[0]]}: ${params.data[2]}`;
							}
						},
						grid: {
							height: '50%',
							top: '15%'
						},
						xAxis: {
							type: 'category',
							data: chartData.labels,
							splitArea: {
								show: true
							},
							axisLabel: {
								color: textColor
							}
						},
						yAxis: {
							type: 'category',
							data: chartData.series.map(s => s.name),
							splitArea: {
								show: true
							},
							axisLabel: {
								color: textColor
							}
						},
						visualMap: {
							min: Math.min(...chartData.series.flatMap(s => s.data)),
							max: Math.max(...chartData.series.flatMap(s => s.data)),
							calculable: true,
							orient: 'horizontal',
							left: 'center',
							bottom: '15%',
							textStyle: {
								color: textColor
							}
						},
						series: heatmapSeries
					};
				} else {
					// 单系列热力图
					return { ...baseOption,
						tooltip: {
							position: 'top'
						},
						grid: {
							height: '50%',
							top: '15%'
						},
						xAxis: {
							type: 'category',
							data: chartData.labels,
							splitArea: {
								show: true
							},
							axisLabel: {
								color: textColor
							}
						},
						yAxis: {
							type: 'category',
							data: ['数据'],
							splitArea: {
								show: true
							},
							axisLabel: {
								color: textColor
							}
						},
						visualMap: {
							min: Math.min(...chartData.values),
							max: Math.max(...chartData.values),
							calculable: true,
							orient: 'horizontal',
							left: 'center',
							bottom: '15%',
							textStyle: {
								color: textColor
							}
						},
						series: [{
							type: 'heatmap',
							data: chartData.values.map((val, idx) => [idx, 0, val]),
							label: {
								show: true
							},
							emphasis: {
								itemStyle: {
									shadowBlur: 10,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							}
						}]
						};
				}
			default:
				return this.getEChartOption({ ...config,
					type: 'bar'
				}, chartData);
		}
	},

	initScroll(containerId) {
		const container = document.getElementById(containerId);
		if (!container) return;

		// 如果内容没有超出容器，不需要滚动
		if (container.scrollHeight <= container.clientHeight) {
			console.log(`⏸️ ${containerId}: 内容未超出，无需滚动`);
			return;
		}

		let isPaused = false;
		let animationId = null;

		const scroll = () => {
			if (!isPaused) {
				container.scrollTop += STATE.scrollSpeed;
				
				// ⚠️ 修复：滚动到底部时立即重置到顶部
				if (container.scrollTop + container.clientHeight >= container.scrollHeight - 1) {
					console.log(`🔄 ${containerId}: 滚动到底部，重新开始`);
					container.scrollTop = 0;
				}
			}
			animationId = requestAnimationFrame(scroll);
		};

		// 鼠标悬停时暂停滚动
		container.addEventListener('mouseenter', () => {
			isPaused = true;
			console.log(`⏸️ ${containerId}: 暂停滚动`);
		});
		
		container.addEventListener('mouseleave', () => {
			isPaused = false;
			console.log(`▶️ ${containerId}: 恢复滚动`);
		});

		// 开始滚动动画
		animationId = requestAnimationFrame(scroll);
		console.log(`✅ ${containerId}: 滚动已启动`);
		
		// 存储动画ID以便后续清理
		if (!STATE.scrollAnimations) {
			STATE.scrollAnimations = new Map();
		}
		STATE.scrollAnimations.set(containerId, animationId);
	},
};

// ==================== Tab 管理器 ====================
const TabManager = {
    init() {
        const tabButtons = document.querySelectorAll('.tab-button');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });

        this.createDynamicTabs();
		// 如果权限接口已返回，这里就不会重复；如果还没返回，等权限回来再触发
        if (!STATE.currentTab) {
          const visible = Array.from(document.querySelectorAll('.tab-button'))
                         .filter(b => b.style.display !== 'none');
          if (visible.length) this.switchTab(visible[0].dataset.tab);
        }
    },

    createDynamicTabs() {
        const tabContentWrapper = document.querySelector('.tab-content-wrapper');
        
        const dynamicTabs = ['purchase', 'sales', 'production', 'inventory', 'calendar', 'milestone', 'techtransfer', 'hr', 'dept'];
        
        dynamicTabs.forEach(tabId => {
            const tabContent = document.createElement('div');
            tabContent.id = `${tabId}-tab`;
            tabContent.className = 'tab-content';
            tabContentWrapper.appendChild(tabContent);
        });
    },

    async switchTab(tabId) {
        // 检查权限
        if (!this.hasPermission(tabId)) {
            console.warn(`⛔ 无权限访问Tab: ${tabId}`);
            return;
        }

        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
        });

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        const targetTab = document.getElementById(`${tabId}-tab`);
        if (targetTab) {
            targetTab.classList.add('active');
            STATE.currentTab = tabId;
            await Renderer.renderTab(tabId);
        }
    },

    // 检查是否有权限访问指定tab
    hasPermission(tabId) {
        // hr 始终有权限（因为它是默认页面）
        if (tabId === 'hr') return true;
        
        // 获取当前允许的tab列表
        const allowedTabs = this.getAllowedTabs();
        return allowedTabs.includes(tabId);
    },

	// 获取当前用户允许的tab列表
	getAllowedTabs() {
		// 优先使用STATE中保存的权限列表
		if (STATE.allowedTabs && STATE.allowedTabs.length > 0) {
			return STATE.allowedTabs;
		}
		
		// 后备：从Tab按钮的显示状态推断
		const visibleTabs = Array.from(document.querySelectorAll('.tab-button'))
			.filter(btn => btn.style.display !== 'none')
			.map(btn => btn.getAttribute('data-tab'));
		
		return visibleTabs;
	},

    // 根据部门权限更新Tab显示
    updateTabVisibility(allowedTabs) {
        const tabButtons = document.querySelectorAll('.tab-button');
        
        console.log('🔄 更新Tab显示，允许的Tab:', allowedTabs);
        
        tabButtons.forEach(button => {
            const tabId = button.getAttribute('data-tab');
            
            if (allowedTabs.includes(tabId)) {
                button.style.display = 'block';
                console.log(`✅ 显示Tab: ${tabId}`);
            } else {
                button.style.display = 'none';
                console.log(`❌ 隐藏Tab: ${tabId}`);
            }
        });

        // 如果当前tab不在允许的tab中，切换到第一个允许的tab
        const currentTab = STATE.currentTab;
        if (currentTab && !allowedTabs.includes(currentTab) && allowedTabs.length > 0) {
            const firstAllowedTab = allowedTabs[0];
            console.log(`🔄 当前Tab ${currentTab} 无权限，切换到: ${firstAllowedTab}`);
            this.switchTab(firstAllowedTab);
        } else if (!currentTab && allowedTabs.length > 0) {
            // 如果没有当前tab，设置第一个允许的tab
            const firstAllowedTab = allowedTabs[0];
            console.log(`🔄 设置初始Tab: ${firstAllowedTab}`);
            this.switchTab(firstAllowedTab);
        }
    }
};

// ==================== 设置面板管理器 ====================
const SettingsManager = {
    init() {
        const panel = document.getElementById('theme-panel');
        const toggleBtn = document.getElementById('theme-toggle');
        const closeBtn = document.getElementById('close-panel');
        const applyBtn = document.getElementById('apply-settings');
        const resetBtn = document.getElementById('reset-settings');
        const darkModeBtn = document.getElementById('dark-mode-toggle');

        toggleBtn.addEventListener('click', () => {
            panel.classList.add('active');
            this.renderFilters();
        });

        closeBtn.addEventListener('click', () => {
            panel.classList.remove('active');
        });

        panel.addEventListener('click', (e) => {
            if (e.target === panel) {
                panel.classList.remove('active');
            }
        });

        applyBtn.addEventListener('click', () => {
            this.applySettings();
        });

        resetBtn.addEventListener('click', () => {
            this.resetSettings();
        });

        darkModeBtn.addEventListener('click', () => {
            this.toggleDarkMode();
        });

        document.getElementById('primary-color').addEventListener('change', (e) => {
            STATE.theme.primary = e.target.value;
            localStorage.setItem('theme-primary', e.target.value);
            this.applyTheme();
        });

        const chartThemeSelect = document.getElementById('chart-theme');
        chartThemeSelect.value = STATE.theme.chartTheme;
        chartThemeSelect.addEventListener('change', (e) => {
            STATE.theme.chartTheme = e.target.value;
            localStorage.setItem('chart-theme', e.target.value);
            console.log('✓ 圖表主題已更新:', e.target.value);
        });

        const speedInput = document.getElementById('scroll-speed');
        const speedValue = document.getElementById('speed-value');
        
        speedInput.addEventListener('input', (e) => {
            STATE.scrollSpeed = parseFloat(e.target.value);
            speedValue.textContent = e.target.value;
            localStorage.setItem('scroll-speed', e.target.value);
        });

        this.loadTheme();
    },

	renderFilters() {
		const container = document.getElementById('dynamic-filters');
		const currentTab = STATE.currentTab;

		// 检查权限
		if (!TabManager.hasPermission(currentTab)) {
			container.innerHTML = '<p style="color:#d32f2f;">⛔ 无权限访问此页面的设置</p>';
			return;
		}

		if (currentTab === 'overview') {
			container.innerHTML = '<p style="color:#666;">概覽頁面無需篩選設定</p>';
			return;
		}

        const filters = STATE.filters[currentTab] || {};
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const startDate = filters.startDate || firstDay.toISOString().split('T')[0];
        const endDate = filters.endDate || lastDay.toISOString().split('T')[0];
        const dateType = filters.dateType || this.getDefaultDateType(currentTab);
        const aggregation = filters.aggregation || 'monthly';
        const textFilterField = filters.textFilterField || '';
        const textFilterValue = filters.textFilterValue || '';

        container.innerHTML = `
            <div class="filter-group">
                <h5>當前頁面:${this.getTabName(currentTab)}</h5>
                
                ${this.getDateTypeOptions(currentTab, dateType)}
                
                <div class="theme-option">
                    <label>開始日期:</label>
                    <input type="date" id="filter-start-date" value="${startDate}">
                </div>
                
                <div class="theme-option">
                    <label>結束日期:</label>
                    <input type="date" id="filter-end-date" value="${endDate}">
                </div>
                
                ${this.shouldShowAggregation(currentTab) ? `
                <div class="theme-option">
                    <label>匯總方式:</label>
                    <select id="filter-aggregation">
                        <option value="daily" ${aggregation === 'daily' ? 'selected' : ''}>按天</option>
                        <option value="weekly" ${aggregation === 'weekly' ? 'selected' : ''}>按週</option>
                        <option value="monthly" ${aggregation === 'monthly' ? 'selected' : ''}>按月</option>
                        <option value="quarterly" ${aggregation === 'quarterly' ? 'selected' : ''}>按季</option>
                        <option value="yearly" ${aggregation === 'yearly' ? 'selected' : ''}>按年</option>
                    </select>
                </div>
                ` : ''}
                
                ${this.getTextFilterOptions(currentTab, textFilterField, textFilterValue)}
            </div>
        `;
    },

    getDateTypeOptions(tabId, currentValue) {
        const dateTypeConfig = {
            purchase: [
                { value: '交货日期', label: '交貨日期' },
                { value: '审核日期', label: '審核日期' }
            ],
            sales: [
                { value: '要货日期', label: '要貨日期' },
                { value: '审核日期', label: '審核日期' }
            ],
            production: [
                { value: '下达日期', label: '下達日期' },
                { value: '开工日期', label: '開工日期' },				
                { value: '完工日期', label: '完工日期' },
                { value: '结案日期', label: '結案日期' }				
            ],
            milestone: [
                { value: '要货日期', label: '要貨日期' },
                { value: '审核日期', label: '審核日期' }
            ],
			techtransfer: [
                { value: '要货日期', label: '要貨日期' },
                { value: '审核日期', label: '審核日期' }
            ],
            inventory: [
                { value: '仓库名称', label: '倉庫名稱' },			
                { value: '物料编码', label: '物料編碼' },
                { value: '物料名称', label: '物料名稱' },
                { value: '规格型号', label: '規格型號' }				
            ],
            calendar: [
                { value: '開始日期', label: '開始日期' }
            ],
            hr: [
                { value: '發佈日期', label: '發佈日期' }
            ],
            dept: [
                { value: '發佈日期', label: '發佈日期' }
            ]
        };

        const options = dateTypeConfig[tabId] || [];
        
        if (options.length === 0) {
            return '';
        }

        const optionsHtml = options.map(opt => 
            `<option value="${opt.value}" ${currentValue === opt.value ? 'selected' : ''}>${opt.label}</option>`
        ).join('');

        return `
            <div class="theme-option">
                <label>日期類型:</label>
                <select id="filter-date-type">
                    ${optionsHtml}
                </select>
            </div>
        `;
    },

	getTextFilterOptions(tabId, currentField, currentValue) {
		const textFilters = TEXT_FILTER_CONFIG[tabId] || [];
		
		if (textFilters.length === 0) {
			return '';
		}

		const optionsHtml = textFilters.map(opt => 
			`<option value="${opt.value}" ${currentField === opt.value ? 'selected' : ''}>${opt.label}</option>`
		).join('');

		return `
			<div class="theme-option">
				<label>字符篩選:</label>
				<select id="filter-text-field">
					<option value="">-- 選擇篩選字段 --</option>
					${optionsHtml}
				</select>
			</div>
			<div class="text-filter-option">
				<label>篩選值:</label>
				<input type="text" id="filter-text-value" value="${currentValue}" 
					   placeholder="輸入篩選內容（支持模糊搜索）" 
					   maxlength="100">
			</div>
			<div style="font-size: 0.8rem; color: #666; margin-top: -8px; margin-bottom: 12px; margin-left: 110px;">
				⚠️ 輸入內容將進行安全過濾，支持 % 模糊匹配
			</div>
		`;
	},

    getDefaultDateType(tabId) {
        const defaults = {
            purchase: '交货日期',
            sales: '要货日期',
            production: '开工日期',
            milestone: '要货日期',
            inventory: '',
            calendar: '開始日期',
            hr: '發佈日期',
            dept: '發佈日期'
        };
        return defaults[tabId] || '';
    },

    getTabName(tabId) {
        const names = {
            purchase: '采購',
            sales: '銷售',
            production: '生產',
            inventory: '庫存',
            calendar: '出差來訪',
            milestone: '里程碑',
            hr: '人力資訊',
            dept: '部門資訊'
        };
        return names[tabId] || tabId;
    },

    shouldShowAggregation(tabId) {
        return ['purchase', 'sales', 'production', 'inventory','milestone'].includes(tabId);
    },

    async applySettings() {
        const currentTab = STATE.currentTab;
        
        if (currentTab === 'overview') {
            document.getElementById('theme-panel').classList.remove('active');
            return;
        }

        const startDate = document.getElementById('filter-start-date')?.value;
        const endDate = document.getElementById('filter-end-date')?.value;
        const dateType = document.getElementById('filter-date-type')?.value;
        const aggregation = document.getElementById('filter-aggregation')?.value;
        const textFilterField = document.getElementById('filter-text-field')?.value;
        const textFilterValue = document.getElementById('filter-text-value')?.value;

        console.log('=== 應用設定 ===');
        console.log('Tab:', currentTab);
        console.log('日期類型:', dateType);
        console.log('開始日期:', startDate);
        console.log('結束日期:', endDate);
        console.log('匯總方式:', aggregation);
        console.log('字符篩選字段:', textFilterField);
        console.log('字符篩選值:', textFilterValue);

        STATE.filters[currentTab] = {
            dateType,
            startDate,
            endDate,
            aggregation,
            textFilterField,
            textFilterValue
        };

        localStorage.setItem(`filters-${currentTab}`, JSON.stringify(STATE.filters[currentTab]));

        document.getElementById('theme-panel').classList.remove('active');

        console.log('🔄 強制刷新數據...');
        await Renderer.renderTab(currentTab, true);
    },

    resetSettings() {
        STATE.theme = {
            primary: '#007a7a',
            dark: false
        };
        STATE.scrollSpeed = 0.5;

        localStorage.removeItem('theme-primary');
        localStorage.removeItem('dark-mode');
        localStorage.removeItem('scroll-speed');

        const currentTab = STATE.currentTab;
        if (currentTab !== 'overview') {
            delete STATE.filters[currentTab];
            localStorage.removeItem(`filters-${currentTab}`);
        }

        document.getElementById('primary-color').value = '#007a7a';
        document.getElementById('scroll-speed').value = '0.5';
        document.getElementById('speed-value').textContent = '0.5';

        this.loadTheme();
        this.renderFilters();
    },

    toggleDarkMode() {
        STATE.theme.dark = !STATE.theme.dark;
        localStorage.setItem('dark-mode', STATE.theme.dark);
        this.applyTheme();
        
        const btn = document.getElementById('dark-mode-toggle');
        btn.textContent = STATE.theme.dark ? '淺色模式' : '深色模式';
    },

    loadTheme() {
        document.getElementById('primary-color').value = STATE.theme.primary;
        document.getElementById('scroll-speed').value = STATE.scrollSpeed;
        document.getElementById('speed-value').textContent = STATE.scrollSpeed.toFixed(1);
        document.getElementById('chart-theme').value = STATE.theme.chartTheme;
        
        this.applyTheme();
    },

    applyTheme() {
        document.body.classList.toggle('dark-mode', STATE.theme.dark);
        
        const btn = document.getElementById('dark-mode-toggle');
        btn.textContent = STATE.theme.dark ? '淺色模式' : '深色模式';

        document.querySelectorAll('th').forEach(th => {
            th.style.backgroundColor = STATE.theme.primary;
        });

        document.querySelectorAll('.panel-header h2').forEach(h2 => {
            h2.style.color = STATE.theme.primary;
        });

        document.querySelector('.header').style.backgroundColor = STATE.theme.primary;
    }
};

// ==================== 认证管理器 ====================
const AuthManager = {
    async init() {
        const loginContainer = document.getElementById('login-container');
        const mainApp = document.getElementById('main-app');
        const logoutBtn = document.getElementById('logout-btn');

        try {
            const configRes = await fetch('/api/config');
            const config = await configRes.json();

            if (!config.enableAuth) {
                loginContainer.style.display = 'none';
                mainApp.style.display = 'flex';
                this.initApp();
                return;
            }
        } catch (error) {
            console.error('獲取配置失敗:', error);
            loginContainer.style.display = 'none';
            mainApp.style.display = 'flex';
            this.initApp();
            return;
        }

        let token = localStorage.getItem('auth-token');
        const urlToken = new URLSearchParams(window.location.search).get('token');
        
        if (urlToken) {
            token = urlToken;
            localStorage.setItem('auth-token', token);
            window.history.replaceState({}, '', '/');
        }

        if (token) {
            const valid = await this.verifyToken(token);
            if (valid) {
                loginContainer.style.display = 'none';
                mainApp.style.display = 'flex';
                logoutBtn.style.display = 'flex';
                this.initApp();
                return;
            } else {
                localStorage.removeItem('auth-token');
            }
        }

        this.showLogin();
    },

    showLogin() {
        const loginContainer = document.getElementById('login-container');
        const loginBox = loginContainer.querySelector('.login-box');
        
        loginBox.innerHTML = `
            <img src="/images/logo.png" alt="Logo" class="login-logo">
            <h2>企业微信登錄</h2>
            <p id="login-tip">請點擊下方按鈕,使用企业微信登錄</p>
            <button id="login-btn" class="login-btn">企业微信登錄</button>
        `;

        const loginBtn = document.getElementById('login-btn');
        loginBtn.addEventListener('click', async () => {
            loginBtn.disabled = true;
            loginBtn.textContent = '跳轉中...';

            try {
                const response = await fetch('/api/login');
                const data = await response.json();
                
                if (data.authUrl) {
                    window.location.href = data.authUrl;
                } else {
                    throw new Error('獲取授權URL失敗');
                }
            } catch (error) {
                console.error('登錄失敗:', error);
                loginBtn.disabled = false;
                loginBtn.textContent = '企业微信登錄';
                alert('登錄失敗,請重試');
            }
        });
    },

    async verifyToken(token) {
        try {
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });
            const data = await response.json();
            return data.valid;
        } catch {
            return false;
        }
    },

	async initApp() {
		// 获取用户信息
		await this.getUserInfo();
		
		// 显示用户信息（调试用）
		this.displayUserInfo();
		
        // 初始化用户会话
        SessionManager.getSessionId(); // 确保会话ID存在
		
		this.updateDateTime();
		setInterval(() => this.updateDateTime(), 1000);

		TabManager.init();
		SettingsManager.init();
		this.initFullscreen();

		// 根据部门权限更新Tab显示（必须在TabManager.init之后）
		this.applyDepartmentPermissions();

		// 不要在这里强制切换到overview，让权限系统决定
		// TabManager.switchTab('overview');

		const logoutBtn = document.getElementById('logout-btn');
		logoutBtn.addEventListener('click', () => {
			localStorage.removeItem('auth-token');
			location.reload();
		});
		
		Object.keys(CONFIG.JSON_FILES).forEach(tabId => {
			const savedFilters = localStorage.getItem(`filters-${tabId}`);
			if (savedFilters) {
				try {
					STATE.filters[tabId] = JSON.parse(savedFilters);
				} catch (e) {
					console.error(`加載${tabId}篩選條件失敗:`, e);
				}
			}
		});
	},

    // 显示用户信息（包含会话信息）
    displayUserInfo() {
        const header = document.querySelector('.header h1');
        if (header && STATE.userInfo.userName) {
            const originalText = header.textContent;
            const sessionId = SessionManager.getSessionId();
            //header.innerHTML = `${originalText} <span style="font-size: 0.8em; color: #ccc;">(${STATE.userInfo.userName} - ${sessionId})</span>`;
			//header.innerHTML = `${originalText} <span style="font-size: 0.8em; color: #ccc;">(${STATE.userInfo.userName} - ${STATE.userInfo.departments.join(', ')})</span>`;
        }
    },
	
    async getUserInfo() {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('/api/user-info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });
            
            if (response.ok) {
                const userInfo = await response.json();
                STATE.userInfo = userInfo;
                console.log('✓ 用戶信息加載成功:', userInfo);
            }
        } catch (error) {
            console.error('獲取用戶信息失敗:', error);
        }
    },

	applyDepartmentPermissions() {
		const userDepartments = STATE.userInfo.departments || [];
		const userId = STATE.userInfo.userId;
		
		console.log('🔐 用户权限检查:', {
			userId: userId,
			departments: userDepartments
		});
		
		let allowedTabs = new Set();
		
		// 1. 优先检查个人权限
		if (userId && USER_PERMISSIONS[userId]) {
			console.log(`✅ 找到个人权限: ${userId} ->`, USER_PERMISSIONS[userId]);
			USER_PERMISSIONS[userId].forEach(tab => allowedTabs.add(tab));
		} else {
			console.log(`ℹ️ 未配置个人权限: ${userId}，检查部门权限`);
			
			// 2. 处理部门层级权限
			let hasExplicitDeptPermissions = false;
			
			userDepartments.forEach(fullDeptPath => {
				const deptPath = fullDeptPath.trim();
				
				// 尝试从最具体的部门路径开始匹配
				const matchedPermission = this.findDeptPermission(deptPath);
				
				if (matchedPermission) {
					console.log(`✅ 匹配部门权限: ${deptPath} ->`, matchedPermission);
					matchedPermission.forEach(tab => allowedTabs.add(tab));
					hasExplicitDeptPermissions = true;
				} else {
					console.log(`⚠️ 未配置部门权限: ${deptPath}`);
				}
			});
			
			// 3. 如果没有明确的部门权限，使用默认权限
			if (!hasExplicitDeptPermissions) {
				console.log('ℹ️ 使用默认权限');
				DEPT_PERMISSIONS.default.forEach(tab => allowedTabs.add(tab));
			}
		}
		
		// 确保至少包含hr（安全后备）
		if (allowedTabs.size === 0 || !allowedTabs.has('hr')) {
			console.log('⚠️ 添加hr到权限列表');
			allowedTabs.add('hr');
		}
		
		// 转换为数组并排序
		const finalTabs = this.sortTabs(Array.from(allowedTabs));
		
		console.log('🔐 最终权限:', finalTabs);
		
		// 保存到STATE供其他地方使用
		STATE.allowedTabs = finalTabs;
		
		TabManager.updateTabVisibility(finalTabs);
		// 取第一个允许显示的 Tab
        const firstTab = finalTabs[0];
        console.log('🚀 自动加载首个 Tab:', firstTab);
        TabManager.switchTab(firstTab);
	},

	// 查找部门权限（支持层级匹配）
	findDeptPermission(deptPath) {
		// 从最具体的路径开始匹配（包含子部门）
		let currentPath = deptPath;
		
		while (currentPath) {
			if (DEPT_PERMISSIONS[currentPath]) {
				return DEPT_PERMISSIONS[currentPath];
			}
			
			// 向上级部门查找（移除最后一级）
			const lastSlashIndex = currentPath.lastIndexOf('/');
			if (lastSlashIndex === -1) {
				break;
			}
			
			currentPath = currentPath.substring(0, lastSlashIndex);
		}
		
		// 如果没有找到具体部门权限，检查是否有顶层部门权限
		const topLevelDept = deptPath.split('/')[0];
		if (DEPT_PERMISSIONS[topLevelDept]) {
			return DEPT_PERMISSIONS[topLevelDept];
		}
		
		return null;
	},

	// 排序tab（保持一致的显示顺序）
	sortTabs(tabs) {
		const order = ['overview', 'purchase', 'sales', 'production', 'inventory', 'calendar', 'milestone', 'techtransfer', 'hr', 'dept'];
		return tabs.sort((a, b) => order.indexOf(a) - order.indexOf(b));
	},

    updateDateTime() {
        const now = new Date();
        const options = {
            timeZone: 'Asia/Hong_Kong',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        document.getElementById('datetime').textContent = now.toLocaleString('zh-CN', options);
    },

    initFullscreen() {
        const btn = document.getElementById('fullscreen-toggle');
        
        btn.addEventListener('click', () => {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                document.documentElement.requestFullscreen();
            }
        });
    }
};

// ==================== 图表设计器 ====================
const ChartDesigner = {
    currentTabId: null,
    currentData: null,
    currentFields: [],
    currentConfig: {
        type: 'bar',
        title: '',
        theme: 'default',
        xAxis: null,
        yAxis: null,
        series: null,
        enableSeries: false,
        aggregation: 'sum',
        limit: 0,
        sortOrder: 'none'
    },
    previewChart: null,
    filters: [],

    // 打开设计器
    open(tabId) {
        this.currentTabId = tabId;
        const modal = document.getElementById('chart-designer-modal');
        
        if (!modal) {
            console.error('图表设计器模态框未找到');
            alert('圖表設計器初始化失敗,請刷新頁面重試');
            return;
        }
        
        // 先显示模态框
        modal.style.display = 'flex';
        
        // 加载数据
        const filename = FileNameManager.getFileName(tabId);
        
        Utils.readJSONFile(filename).then(data => {
            const detail = data.detail || [];
            if (detail.length === 0) {
                alert('暫無明細數據,無法設計圖表');
                this.close();
                return;
            }

            this.currentData = detail;
            this.currentFields = Object.keys(detail[0]);
            
            console.log('✅ 数据加载成功:', {
                tabId,
                records: detail.length,
                fields: this.currentFields.length
            });
            
            this.init();
        }).catch(err => {
            console.error('❌ 加载数据失败:', err);
            alert('無法加載數據:' + err.message);
            this.close();
        });
    },

    // 初始化设计器
    init() {
        // 验证必要的 DOM 元素
        const requiredElements = [
            'available-fields',
            'field-search',
            'chart-preview',
            'data-preview',
            'data-count',
            'chart-title',
            'chart-theme-select',
            'enable-series',
            'aggregation-method',
            'data-limit',
            'sort-order',
            'filter-list',
            'preview-data-count',
            'preview-filtered-count'
        ];
        
        const missingElements = requiredElements.filter(id => !document.getElementById(id));
        
        if (missingElements.length > 0) {
            console.error('❌ 缺少必要的 DOM 元素:', missingElements);
            alert('圖表設計器初始化失敗:部分界面元素未加載\n缺少元素:' + missingElements.join(', '));
            this.close();
            return;
        }
        
        console.log('✅ DOM 元素验证通过,开始初始化...');
        
        // 等待 DOM 完全准备好
        setTimeout(() => {
            try {
                this.renderFields();
                this.renderChartTypes();
                this.initDragAndDrop();
                this.initEventListeners();
                this.updateDataPreview();
                this.renderFilters();
                this.refreshPreview();
                
                console.log('✅ 图表设计器初始化完成');
            } catch (error) {
                console.error('❌ 初始化过程出错:', error);
                alert('圖表設計器初始化失敗:' + error.message);
                this.close();
            }
        }, 100);
    },

    // 渲染字段列表
    renderFields() {
        const container = document.getElementById('available-fields');
        const searchInput = document.getElementById('field-search');
        
        if (!container || !searchInput) {
            console.error('字段容器未找到');
            return;
        }
        
        const renderFilteredFields = (filter = '') => {
            const filtered = this.currentFields.filter(field => 
                field.toLowerCase().includes(filter.toLowerCase())
            );
            
            container.innerHTML = filtered.map(field => `
                <div class="field-item" draggable="true" data-field="${field}">
                    <svg class="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <path d="M3 9h18M9 3v18"/>
                    </svg>
                    <span>${field}</span>
                </div>
            `).join('');
            
            // 重新绑定拖拽事件
            container.querySelectorAll('.field-item').forEach(item => {
                item.addEventListener('dragstart', this.handleDragStart.bind(this));
                item.addEventListener('dragend', this.handleDragEnd.bind(this));
            });
        };

        renderFilteredFields();
        
        // 搜索功能
        searchInput.addEventListener('input', (e) => {
            renderFilteredFields(e.target.value);
        });
    },

    // 渲染图表类型
    renderChartTypes() {
        const types = document.querySelectorAll('.chart-type-item');
        types.forEach(item => {
            item.addEventListener('click', () => {
                types.forEach(t => t.classList.remove('active'));
                item.classList.add('active');
                this.currentConfig.type = item.dataset.type;
                this.updateSeriesVisibility();
                this.refreshPreview();
            });
        });
        
        // 默认选中柱状图
        types[0]?.classList.add('active');
    },

    // 初始化拖拽功能
    initDragAndDrop() {
        const dropZones = document.querySelectorAll('.drop-zone');
        
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', this.handleDragOver.bind(this));
            zone.addEventListener('dragleave', this.handleDragLeave.bind(this));
            zone.addEventListener('drop', this.handleDrop.bind(this));
        });
    },

    // 拖拽开始
    handleDragStart(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', e.target.dataset.field);
        e.target.classList.add('dragging');
    },

    // 拖拽结束
    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    },

    // 拖拽悬停
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const dropZone = e.currentTarget;
        dropZone.classList.add('drag-over');
    },

    // 拖拽离开
    handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    },

    // 拖拽放下
    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        
        const fieldName = e.dataTransfer.getData('text/plain');
        const dropZone = e.currentTarget;
        const axis = dropZone.dataset.axis;
        
        this.addFieldToAxis(axis, fieldName);
        this.refreshPreview();
    },

    // 添加字段到轴
    addFieldToAxis(axis, fieldName) {
        const content = document.querySelector(`#drop-${axis}-axis .drop-zone-content`);
        
        // 清空当前内容(单选模式)
        content.innerHTML = '';
        
        // 添加新字段
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'dropped-field';
        fieldDiv.innerHTML = `
            <span>${fieldName}</span>
            <button class="remove-btn" onclick="ChartDesigner.removeField('${axis}')">×</button>
        `;
        content.appendChild(fieldDiv);
        
        // 更新配置
        if (axis === 'x') {
            this.currentConfig.xAxis = fieldName;
        } else if (axis === 'y') {
            this.currentConfig.yAxis = fieldName;
        } else if (axis === 'series') {
            this.currentConfig.series = fieldName;
        }
    },

    // 移除字段
    removeField(axis) {
        const content = document.querySelector(`#drop-${axis}-axis .drop-zone-content`);
        content.innerHTML = '';
        
        if (axis === 'x') {
            this.currentConfig.xAxis = null;
        } else if (axis === 'y') {
            this.currentConfig.yAxis = null;
        } else if (axis === 'series') {
            this.currentConfig.series = null;
        }
        
        this.refreshPreview();
    },

    // 初始化事件监听
    initEventListeners() {
        // 图表标题
        const titleInput = document.getElementById('chart-title');
        if (titleInput) {
            titleInput.addEventListener('input', (e) => {
                this.currentConfig.title = e.target.value;
                this.refreshPreview();
            });
        }

        // 主题选择
        const themeSelect = document.getElementById('chart-theme-select');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.currentConfig.theme = e.target.value;
                this.refreshPreview();
            });
        }

        // 多系列开关
        const seriesCheckbox = document.getElementById('enable-series');
        if (seriesCheckbox) {
            seriesCheckbox.addEventListener('change', (e) => {
                this.currentConfig.enableSeries = e.target.checked;
                this.updateSeriesVisibility();
                this.refreshPreview();
            });
        }

        // 聚合方式
        const aggSelect = document.getElementById('aggregation-method');
        if (aggSelect) {
            aggSelect.addEventListener('change', (e) => {
                this.currentConfig.aggregation = e.target.value;
                this.refreshPreview();
            });
        }

        // 数据限制
        const limitInput = document.getElementById('data-limit');
        if (limitInput) {
            limitInput.addEventListener('change', (e) => {
                this.currentConfig.limit = parseInt(e.target.value) || 0;
                this.refreshPreview();
            });
        }

        // 排序
        const sortSelect = document.getElementById('sort-order');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentConfig.sortOrder = e.target.value;
                this.refreshPreview();
            });
        }
    },

    // 更新系列配置可见性
    updateSeriesVisibility() {
        const seriesConfig = document.getElementById('series-config');
        const seriesZone = document.getElementById('drop-series');
        
        // 只有特定图表类型支持多系列
        const supportsSeries = ['bar', 'line', 'scatter'].includes(this.currentConfig.type);
        
        if (supportsSeries) {
            seriesConfig.style.display = 'block';
            if (this.currentConfig.enableSeries) {
                seriesZone.style.display = 'flex';
            } else {
                seriesZone.style.display = 'none';
                this.currentConfig.series = null;
            }
        } else {
            seriesConfig.style.display = 'none';
            seriesZone.style.display = 'none';
            this.currentConfig.series = null;
            this.currentConfig.enableSeries = false;
        }
    },

    // 添加过滤条件
    addFilter() {
        this.filters.push({
            field: this.currentFields[0] || '',
            operator: 'contains',
            value: ''
        });
        this.renderFilters();
    },

    // 渲染过滤条件
    renderFilters() {
        const container = document.getElementById('filter-list');
        
        if (!container) {
            console.error('过滤器容器未找到');
            return;
        }
        
        container.innerHTML = this.filters.map((filter, index) => `
            <div class="filter-item">
                <div class="filter-row">
                    <select onchange="ChartDesigner.updateFilter(${index}, 'field', this.value)">
                        ${this.currentFields.map(field => 
                            `<option value="${field}" ${filter.field === field ? 'selected' : ''}>${field}</option>`
                        ).join('')}
                    </select>
                    <button class="filter-remove-btn" onclick="ChartDesigner.removeFilter(${index})">×</button>
                </div>
                <div class="filter-row">
                    <select onchange="ChartDesigner.updateFilter(${index}, 'operator', this.value)">
                        <option value="contains" ${filter.operator === 'contains' ? 'selected' : ''}>包含</option>
                        <option value="equals" ${filter.operator === 'equals' ? 'selected' : ''}>等於</option>
                        <option value="gt" ${filter.operator === 'gt' ? 'selected' : ''}>大於</option>
                        <option value="lt" ${filter.operator === 'lt' ? 'selected' : ''}>小於</option>
                        <option value="gte" ${filter.operator === 'gte' ? 'selected' : ''}>大於等於</option>
                        <option value="lte" ${filter.operator === 'lte' ? 'selected' : ''}>小於等於</option>
                    </select>
                    <input type="text" value="${filter.value}" 
                           onchange="ChartDesigner.updateFilter(${index}, 'value', this.value)"
                           placeholder="篩選值" />
                </div>
            </div>
        `).join('');
    },

    // 更新过滤条件
    updateFilter(index, key, value) {
        this.filters[index][key] = value;
        this.refreshPreview();
    },

    // 移除过滤条件
    removeFilter(index) {
        this.filters.splice(index, 1);
        this.renderFilters();
        this.refreshPreview();
    },

    // 应用过滤条件
    applyFilters(data) {
        return data.filter(item => {
            return this.filters.every(filter => {
                const fieldValue = String(item[filter.field] || '');
                const filterValue = String(filter.value);

                switch (filter.operator) {
                    case 'contains':
                        return fieldValue.toLowerCase().includes(filterValue.toLowerCase());
                    case 'equals':
                        return fieldValue === filterValue;
                    case 'gt':
                        return parseFloat(fieldValue) > parseFloat(filterValue);
                    case 'lt':
                        return parseFloat(fieldValue) < parseFloat(filterValue);
                    case 'gte':
                        return parseFloat(fieldValue) >= parseFloat(filterValue);
                    case 'lte':
                        return parseFloat(fieldValue) <= parseFloat(filterValue);
                    default:
                        return true;
                }
            });
        });
    },

    // 刷新预览
    refreshPreview() {
        const container = document.getElementById('chart-preview');
        
        if (!container) {
            console.error('预览容器未找到');
            return;
        }
        
        // 销毁旧图表
        if (this.previewChart) {
            this.previewChart.dispose();
        }

        // 检查必要字段
        if (!this.currentConfig.xAxis || !this.currentConfig.yAxis) {
            container.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:center;height:100%;color:#999;flex-direction:column;gap:12px;">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    <div>請拖拽字段到 X軸 和 Y軸 區域開始設計</div>
                </div>
            `;
            return;
        }

        // 应用过滤
        let filteredData = this.applyFilters(this.currentData);

        // 更新统计信息
        const dataCountEl = document.getElementById('preview-data-count');
        const filteredCountEl = document.getElementById('preview-filtered-count');
        
        if (dataCountEl) {
            dataCountEl.textContent = `數據: ${filteredData.length} 項`;
        }
        
        if (filteredCountEl) {
            if (this.filters.length > 0) {
                filteredCountEl.textContent = 
                    `(已篩選 ${this.currentData.length - filteredData.length} 項)`;
            } else {
                filteredCountEl.textContent = '';
            }
        }

        // 准备图表数据
        const chartData = this.prepareChartData(filteredData);
        
        // 创建图表
        this.previewChart = echarts.init(container, this.currentConfig.theme);
        const option = this.generateChartOption(chartData);
        this.previewChart.setOption(option);

        // 响应式
        const resizeHandler = () => {
            if (this.previewChart) {
                this.previewChart.resize();
            }
        };
        
        // 移除旧的监听器
        window.removeEventListener('resize', this.resizeHandler);
        this.resizeHandler = resizeHandler;
        window.addEventListener('resize', this.resizeHandler);
    },

    // 准备图表数据
    prepareChartData(data) {
        const xField = this.currentConfig.xAxis;
        const yField = this.currentConfig.yAxis;
        const seriesField = this.currentConfig.series;
        const aggregation = this.currentConfig.aggregation;

        if (this.currentConfig.enableSeries && seriesField) {
            // 多系列数据
            const seriesMap = new Map();
            const allLabels = new Set();

            data.forEach(item => {
                const label = item[xField] || 'Unknown';
                const value = parseFloat(item[yField]) || 0;
                const series = item[seriesField] || 'Default';

                allLabels.add(label);

                if (!seriesMap.has(series)) {
                    seriesMap.set(series, new Map());
                }

                const currentMap = seriesMap.get(series);
                if (currentMap.has(label)) {
                    const existing = currentMap.get(label);
                    currentMap.set(label, this.aggregate(existing, value, aggregation));
                } else {
                    currentMap.set(label, { value, count: 1 });
                }
            });

            let labels = Array.from(allLabels);
            const series = [];

            seriesMap.forEach((labelMap, seriesName) => {
                series.push({
                    name: seriesName,
                    data: labels.map(label => {
                        const item = labelMap.get(label);
                        return item ? this.getFinalValue(item, aggregation) : 0;
                    })
                });
            });

            // 排序和限制
            const result = this.applySortAndLimit({ labels, values: series[0]?.data || [], isSeries: true, series });
            return result;
        } else {
            // 单系列数据
            const dataMap = new Map();

            data.forEach(item => {
                const label = item[xField] || 'Unknown';
                const value = parseFloat(item[yField]) || 0;

                if (dataMap.has(label)) {
                    const existing = dataMap.get(label);
                    dataMap.set(label, this.aggregate(existing, value, aggregation));
                } else {
                    dataMap.set(label, { value, count: 1 });
                }
            });

            let labels = Array.from(dataMap.keys());
            let values = labels.map(label => this.getFinalValue(dataMap.get(label), aggregation));

            // 排序和限制
            const result = this.applySortAndLimit({ labels, values, isSeries: false });
            return result;
        }
    },

    // 聚合数据
    aggregate(existing, newValue, method) {
        switch (method) {
            case 'sum':
                return { value: existing.value + newValue, count: existing.count + 1 };
            case 'avg':
                return { value: existing.value + newValue, count: existing.count + 1 };
            case 'count':
                return { value: existing.value, count: existing.count + 1 };
            case 'max':
                return { value: Math.max(existing.value, newValue), count: existing.count + 1 };
            case 'min':
                return { value: Math.min(existing.value, newValue), count: existing.count + 1 };
            default:
                return existing;
        }
    },

    // 获取最终值
    getFinalValue(item, method) {
        if (method === 'avg') {
            return item.value / item.count;
        } else if (method === 'count') {
            return item.count;
        }
        return item.value;
    },

    // 应用排序和限制
    applySortAndLimit(chartData) {
        const { labels, values, isSeries, series } = chartData;

        // 创建索引数组
        let indices = labels.map((_, i) => i);

        // 排序
        if (this.currentConfig.sortOrder !== 'none') {
            indices.sort((a, b) => {
                const valueA = isSeries ? series[0].data[a] : values[a];
                const valueB = isSeries ? series[0].data[b] : values[b];
                return this.currentConfig.sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
            });
        }

        // 限制
        if (this.currentConfig.limit > 0) {
            indices = indices.slice(0, this.currentConfig.limit);
        }

        // 重新排列
        const newLabels = indices.map(i => labels[i]);
        
        if (isSeries) {
            const newSeries = series.map(s => ({
                name: s.name,
                data: indices.map(i => s.data[i])
            }));
            return { labels: newLabels, isSeries: true, series: newSeries };
        } else {
            const newValues = indices.map(i => values[i]);
            return { labels: newLabels, values: newValues, isSeries: false };
        }
    },

    // 生成图表配置
    generateChartOption(chartData) {
        const isDark = STATE.theme.dark;
        const textColor = isDark ? '#e0e0e0' : '#333';

        const baseOption = {
            title: {
                text: this.currentConfig.title || '數據圖表',
                left: 'center',
                textStyle: { color: textColor, fontSize: 16, fontWeight: 600 }
            },
            tooltip: {
                trigger: 'item',
                backgroundColor: isDark ? 'rgba(50,50,50,0.9)' : 'rgba(255,255,255,0.9)',
                textStyle: { color: textColor }
            },
            legend: {
                show: chartData.isSeries,
                top: 'bottom',
                textStyle: { color: textColor }
            }
        };

        const type = this.currentConfig.type;

        switch (type) {
            case 'bar':
            case 'line':
                return {
                    ...baseOption,
                    grid: { left: '3%', right: '4%', bottom: chartData.isSeries ? '20%' : '10%', top: '15%', containLabel: true },
                    xAxis: {
                        type: 'category',
                        data: chartData.labels,
                        axisLabel: { color: textColor, rotate: chartData.labels.length > 8 ? 45 : 0 }
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: { color: textColor }
                    },
                    series: chartData.isSeries
                        ? chartData.series.map(s => ({ name: s.name, type: type, data: s.data, smooth: type === 'line' }))
                        : [{ type: type, data: chartData.values, smooth: type === 'line' }]
                };

            case 'pie':
                return {
                    ...baseOption,
                    series: [{
                        type: 'pie',
                        radius: ['40%', '70%'],
                        center: ['50%', '55%'],
                        data: chartData.labels.map((label, idx) => ({
                            name: label,
                            value: chartData.values[idx]
                        })),
                        label: { color: textColor }
                    }]
                };

            case 'scatter':
                return {
                    ...baseOption,
                    grid: { left: '3%', right: '4%', bottom: '10%', top: '15%', containLabel: true },
                    xAxis: { type: 'category', data: chartData.labels, axisLabel: { color: textColor } },
                    yAxis: { type: 'value', axisLabel: { color: textColor } },
                    series: chartData.isSeries
                        ? chartData.series.map(s => ({
                            name: s.name,
                            type: 'scatter',
                            data: s.data.map((val, idx) => [chartData.labels[idx], val]),
                            symbolSize: 12
                        }))
                        : [{
                            type: 'scatter',
                            data: chartData.values.map((val, idx) => [chartData.labels[idx], val]),
                            symbolSize: 12
                        }]
                };

            case 'radar':
                return {
                    ...baseOption,
                    radar: {
                        indicator: chartData.labels.map(label => ({ name: label })),
                        axisName: { color: textColor }
                    },
                    series: [{
                        type: 'radar',
                        data: [{ value: chartData.values, name: this.currentConfig.title || 'Data' }]
                    }]
                };

            case 'funnel':
                return {
                    ...baseOption,
                    series: [{
                        type: 'funnel',
                        left: '10%',
                        width: '80%',
                        data: chartData.labels.map((label, idx) => ({
                            name: label,
                            value: chartData.values[idx]
                        })).sort((a, b) => b.value - a.value),
                        label: { color: textColor }
                    }]
                };

            default:
                return baseOption;
        }
    },

    // 更新数据预览
    updateDataPreview() {
        const container = document.getElementById('data-preview');
        const countSpan = document.getElementById('data-count');
        
        if (!container || !countSpan) {
            console.error('数据预览容器未找到');
            return;
        }
        
        countSpan.textContent = `${this.currentData.length} 條記錄`;
        
        // 只显示前100条
        const previewData = this.currentData.slice(0, 100);
        const columns = this.currentFields;
        
        const html = `
            <table class="detail-table" style="font-size: 11px;">
                <thead>
                    <tr>${columns.map(col => `<th>${col}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${previewData.map(row => `
                        <tr>${columns.map(col => `<td>${row[col] || ''}</td>`).join('')}</tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        container.innerHTML = html;
    },

    // 导出图表
    exportChart() {
        if (!this.previewChart) {
            alert('請先設計圖表');
            return;
        }

        const url = this.previewChart.getDataURL({
            type: 'png',
            pixelRatio: 2,
            backgroundColor: '#fff'
        });

        const link = document.createElement('a');
        link.href = url;
        link.download = `chart_${Date.now()}.png`;
        link.click();
    },

    // 复制配置
    copyConfig() {
        const config = JSON.stringify({
            type: this.currentConfig.type,
            title: this.currentConfig.title,
            theme: this.currentConfig.theme,
            xAxis: this.currentConfig.xAxis,
            yAxis: this.currentConfig.yAxis,
            series: this.currentConfig.series,
            enableSeries: this.currentConfig.enableSeries,
            aggregation: this.currentConfig.aggregation,
            limit: this.currentConfig.limit,
            sortOrder: this.currentConfig.sortOrder,
            filters: this.filters
        }, null, 2);

        navigator.clipboard.writeText(config).then(() => {
            alert('配置已複製到剪貼板!');
        }).catch(() => {
            alert('複製失敗');
        });
    },

    // 保存为模板
    saveAsTemplate() {
        const name = prompt('請輸入模板名稱:');
        if (!name) return;

        const template = {
            name,
            config: { ...this.currentConfig },
            filters: [...this.filters]
        };

        const templates = JSON.parse(localStorage.getItem('chart-templates') || '[]');
        templates.push(template);
        localStorage.setItem('chart-templates', JSON.stringify(templates));

        alert('模板已保存!');
    },

    // 加载模板
    loadTemplate() {
        const templates = JSON.parse(localStorage.getItem('chart-templates') || '[]');
        
        if (templates.length === 0) {
            alert('暫無已保存的模板');
            return;
        }

        const options = templates.map((t, i) => `${i + 1}. ${t.name}`).join('\n');
        const choice = prompt(`選擇要加載的模板:\n${options}\n\n輸入序號:`);
        
        if (!choice) return;

        const index = parseInt(choice) - 1;
        if (index < 0 || index >= templates.length) {
            alert('無效的選擇');
            return;
        }

        const template = templates[index];
        this.currentConfig = { ...template.config };
        this.filters = [...template.filters];

        // 更新UI
        document.getElementById('chart-title').value = this.currentConfig.title || '';
        document.getElementById('chart-theme-select').value = this.currentConfig.theme;
        document.getElementById('enable-series').checked = this.currentConfig.enableSeries;
        document.getElementById('aggregation-method').value = this.currentConfig.aggregation;
        document.getElementById('data-limit').value = this.currentConfig.limit;
        document.getElementById('sort-order').value = this.currentConfig.sortOrder;

        // 更新拖放区域
        if (this.currentConfig.xAxis) {
            this.addFieldToAxis('x', this.currentConfig.xAxis);
        }
        if (this.currentConfig.yAxis) {
            this.addFieldToAxis('y', this.currentConfig.yAxis);
        }
        if (this.currentConfig.series) {
            this.addFieldToAxis('series', this.currentConfig.series);
        }

        this.renderFilters();
        this.updateSeriesVisibility();
        this.refreshPreview();

        alert('模板已加載!');
    },

    // 保存图表配置
    async saveChart() {
        if (!this.currentConfig.xAxis || !this.currentConfig.yAxis) {
            alert('請至少設置 X軸 和 Y軸');
            return;
        }

        const config = {
            tabId: this.currentTabId,
            type: this.currentConfig.type,
            title: this.currentConfig.title || '自定義圖表',
            theme: this.currentConfig.theme,
            labelColumn: this.currentConfig.xAxis,
            dataColumn: this.currentConfig.yAxis,
            seriesColumn: this.currentConfig.enableSeries ? this.currentConfig.series : null,
            aggregation: this.currentConfig.aggregation,
            limit: this.currentConfig.limit,
            sortOrder: this.currentConfig.sortOrder,
            filters: this.filters,
            order: 999 // 放在最后
        };

        console.log('保存圖表配置:', config);
        
        // 这里可以调用API保存配置
        try {
            const response = await fetch('/api/save-chart-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            if (response.ok) {
                alert('圖表配置已保存!刷新頁面後生效');
                this.close();
            } else {
                alert('保存失敗');
            }
        } catch (error) {
            console.error('保存失敗:', error);
            alert('保存失敗:' + error.message);
        }
    },

    // 重置设计器
    reset() {
        if (!confirm('確定要重置所有設置嗎?')) return;

        this.currentConfig = {
            type: 'bar',
            title: '',
            theme: 'default',
            xAxis: null,
            yAxis: null,
            series: null,
            enableSeries: false,
            aggregation: 'sum',
            limit: 0,
            sortOrder: 'none'
        };

        this.filters = [];

        document.getElementById('chart-title').value = '';
        document.getElementById('chart-theme-select').value = 'default';
        document.getElementById('enable-series').checked = false;
        document.getElementById('aggregation-method').value = 'sum';
        document.getElementById('data-limit').value = 0;
        document.getElementById('sort-order').value = 'none';

        document.querySelectorAll('.drop-zone-content').forEach(content => {
            content.innerHTML = '';
        });

        document.querySelectorAll('.chart-type-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector('.chart-type-item[data-type="bar"]')?.classList.add('active');

        this.renderFilters();
        this.updateSeriesVisibility();
        this.refreshPreview();
    },

    // 关闭设计器
    close() {
        if (this.previewChart) {
            this.previewChart.dispose();
            this.previewChart = null;
        }
        
        document.getElementById('chart-designer-modal').style.display = 'none';
    }
};

// 旧版图表设计器兼容性
window.openChartDesigner = function() {
    const tabId = STATE.currentTab;
    ChartDesigner.open(tabId);
};

window.closeChartDesigner = function() {
    ChartDesigner.close();
};	


window.renderChartList = function () {
  const container = document.getElementById('chart-list');
  const charts = STATE.userCharts || [];

  container.innerHTML = charts.map((chart, idx) => `
    <div class="chart-item" data-index="${idx}">
      <input type="text" placeholder="图表标题" value="${chart.title || ''}" onchange="updateChart(${idx}, 'title', this.value)">
      <select onchange="updateChart(${idx}, 'type', this.value)">
        <option value="bar" ${chart.type === 'bar' ? 'selected' : ''}>柱状图</option>
        <option value="line" ${chart.type === 'line' ? 'selected' : ''}>折线图</option>
        <option value="pie" ${chart.type === 'pie' ? 'selected' : ''}>饼图</option>
      </select>
      <select onchange="updateChart(${idx}, 'labelColumn', this.value)">
        <option value="">选择X轴字段</option>
        ${STATE.chartDesignerSchema.map(key => `<option ${chart.labelColumn === key ? 'selected' : ''}>${key}</option>`).join('')}
      </select>
      <select onchange="updateChart(${idx}, 'dataColumn', this.value)">
        <option value="">选择Y轴字段</option>
        ${STATE.chartDesignerSchema.map(key => `<option ${chart.dataColumn === key ? 'selected' : ''}>${key}</option>`).join('')}
      </select>
      <select class="chart-width-select" onchange="updateChart(${idx}, 'width', this.value)">
        <option value="50" ${chart.width === '50' ? 'selected' : ''}>50%宽</option>
        <option value="100" ${chart.width === '100' ? 'selected' : ''}>100%宽</option>
      </select>
      <button class="secondary-btn" onclick="removeChart(${idx})">删除</button>
    </div>
  `).join('');
};

window.addNewChart = function () {
  STATE.userCharts = STATE.userCharts || [];
  STATE.userCharts.push({
    title: '新图表',
    type: 'bar',
    labelColumn: '',
    dataColumn: '',
    width: '50'
  });
  renderChartList();
};

window.updateChart = function (idx, key, value) {
  STATE.userCharts[idx][key] = value;
};

window.removeChart = function (idx) {
  if (confirm('确定删除这个图表吗？')) {
    STATE.userCharts.splice(idx, 1);
    renderChartList();
  }
};

window.saveChartConfig = async function () {
  const tabId = STATE.currentTab;
  const payload = {
    tabId,
    charts: STATE.userCharts
  };

  try {
    const res = await fetch('/api/charts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert('图表配置已保存');
      closeChartDesigner();
    } else {
      alert('保存失败：' + res.statusText);
    }
  } catch (err) {
    alert('网络错误：' + err.message);
  }
};

// ==================== 会话管理器 ====================
const SessionManager = {
    // 生成用户会话ID（登录时生成，直到下次重新登录才变）
    generateSessionId() {
        const userId = STATE.userInfo.userId || 'anonymous';
        const randomSuffix = Math.random().toString(36).substring(2, 8); // 6位随机数
        const sessionId = `${userId}_${randomSuffix}`;
        
        // 保存到localStorage，直到用户重新登录
        localStorage.setItem('user-session-id', sessionId);
        console.log('🔑 生成用户会话ID:', sessionId);
        return sessionId;
    },

    // 获取当前会话ID
    getSessionId() {
        let sessionId = localStorage.getItem('user-session-id');
        
        // 如果还没有会话ID或者用户信息发生变化，生成新的
        if (!sessionId || this.shouldRenewSession()) {
            sessionId = this.generateSessionId();
        }
        
        return sessionId;
    },

    // 检查是否需要更新会话（用户信息变化时）
    shouldRenewSession() {
        const currentUserId = STATE.userInfo.userId;
        const storedSessionId = localStorage.getItem('user-session-id');
        
        if (!storedSessionId) return true;
        
        // 从存储的sessionId中提取用户ID
        const storedUserId = storedSessionId.split('_')[0];
        return storedUserId !== currentUserId;
    },

    // 清除会话（登出时）
    clearSession() {
        localStorage.removeItem('user-session-id');
        console.log('🔑 清除用户会话');
    }
};

// ==================== 应用入口 ====================
document.addEventListener('DOMContentLoaded', () => {
    AuthManager.init();
});