import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const effectBlock = `
  useEffect(() => {
    if (currentUser?.role === 'citizen') {
      apiGetAppointments().then(res => {
        if (res) {
          setUpcomingCount(res.filter(a => a.status === 'upcoming').length);
        }
      }).catch(() => {});
    }
  }, [currentUser, currentRoute]);
`;

content = content.replace("  });\n\n  // Portal auxiliary state", "  });\n" + effectBlock + "\n  // Portal auxiliary state");
fs.writeFileSync('src/App.tsx', content);
