import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// first remove the wrongly placed one
const badBlock = `    useEffect(() => {
    if (currentUser?.role === 'citizen') {
      apiGetAppointments().then(res => {
        if (res) {
          setUpcomingCount(res.filter(a => a.status === 'upcoming').length);
        }
      }).catch(() => {});
    }
  }, [currentUser, currentRoute]);`;

content = content.replace(badBlock, '');

// now insert it at the correct place
const correctInsertion = `  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    const route = parseCurrentRoute();`;

const newCode = `  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    const route = parseCurrentRoute();`;

content = content.replace(correctInsertion, newCode); // wait, need to add it AFTER setCurrentRoute finishes!

fs.writeFileSync('src/App.tsx', content);
