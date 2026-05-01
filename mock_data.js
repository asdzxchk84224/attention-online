const names = ['王小明', '李大華', '陳偉杰', '林俊宇', '張家豪', '黃建宏', '吳宗憲', '劉德華'];
const statuses = ['軍樂', '軍儀', '校旗', '區隊長公差', '大美', '伙委', '洗委', '降旗'];
const dbUrl = "https://firestore.googleapis.com/v1/projects/airforce-5b199/databases/(default)/documents";
const key = "?key=AIzaSyDfAu3HoMEqtYwOg1_P0qNOOJye2dKhw0I";

async function run() {
    for(let i=0; i<8; i++) {
        const studentName = names[i];
        const newStatus = statuses[i];
        
        console.log(`Adding student ${studentName}...`);
        
        // 1. Add student
        const studentBody = {
            fields: {
                squadron: { stringValue: "一大一中" },
                class: { stringValue: "01班" },
                group: { stringValue: "無" },
                name: { stringValue: studentName },
                password: { stringValue: "0000" },
                role: { stringValue: "student" },
                status: { mapValue: { fields: {} } },
                timestamp: { timestampValue: new Date().toISOString() }
            }
        };

        const stdRes = await fetch(`${dbUrl}/students${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentBody)
        });
        const stdData = await stdRes.json();
        const docId = stdData.name.split('/').pop();

        // 2. Create approval history directly (simulating request -> approve flow)
        // Since the prompt asks to verify: "實習班長何時審核", we simulate the final state.
        const reqTime = new Date(Date.now() - 3600000).toISOString(); // 1 hour ago
        const processTime = new Date(Date.now() - 1800000).toISOString(); // 30 mins ago
        
        console.log(`Adding history for ${studentName}...`);
        
        const historyBody = {
            fields: {
                studentId: { stringValue: docId },
                studentName: { stringValue: studentName },
                studentClass: { stringValue: "01班" },
                studentGroup: { stringValue: "無" },
                dayName: { stringValue: "星期三" },
                sessionName: { stringValue: "早點名" },
                originStatus: { stringValue: "實到" },
                newStatus: { stringValue: newStatus },
                requesterName: { stringValue: studentName },
                processorName: { stringValue: "張雲翰" }, // The newly added class_admin
                requestTime: { stringValue: reqTime }, // ADDED request time missing before
                action: { stringValue: "approve" },
                timestamp: { timestampValue: processTime } // 審核時間
            }
        };

        await fetch(`${dbUrl}/approval_history${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(historyBody)
        });
        
        // 3. Update student status in DB manually
        const updateBody = {
            fields: {
                ...stdData.fields,
                status: {
                    mapValue: {
                        fields: {
                            "星期二_早點名": { stringValue: newStatus }
                        }
                    }
                }
            }
        };
        
        await fetch(`${dbUrl}/students/${docId}${key}?currentDocument.exists=true`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateBody)
        });
        
    }
    console.log("Done adding 8 students and their approval histories.");
}

run();
