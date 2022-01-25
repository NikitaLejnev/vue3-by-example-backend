const {
  createDb,
  express,
  sqlite3,
  router,
  verifyToken,
} = require("./helper");

router.get("/", (req, res, next) => {
  const db = createDb();
  db.serialize(() => {
    db.all("SELECT * FROM catalog_items", [], (err, rows = [])
      => {
      res.json(rows);
    });
  });
  db.close();
});

router.post('/', verifyToken, (req, res) => {
  const { name, description, imageUrl } = req.body;
  const db = createDb();
  db.serialize(() => {
    const stmt = db.prepare(`
    INSERT INTO catalog_items (
      name, description, image_url
    ) VALUES (?, ?, ?)
  `
    );
    stmt.run(name, description, imageUrl);
    stmt.finalize();
    res.json({ status: 'success' });
  })
  db.close();
});

router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const db = createDb();
  db.serialize(() => {
    const stmt = db.prepare("DELETE FROM catalog_items WHERE id = (?)");
    stmt.run(id);
    stmt.finalize();
    res.json({ status: 'success' });
  });
  db.close();
})

module.exports = router;
