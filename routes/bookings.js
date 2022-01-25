const {
  createDb,
  express,
  sqlite3,
  router,
  verifyToken,
} = require("./helper");

router.get("/", (req, res, next) => {
  const db = createDb();
  db.serialize(() =>
    db.all(
      `
      SELECT
        bookings.*,
        catalog_items.name AS catalog_item_name,
        catalog_items.description AS catalog_item_description
      FROM bookings
      INNER JOIN catalog_items ON catalog_items.id =
        bookings.catalog_items_id
        `,
      [],
      (err, rows = []) => {
        res.json(rows);
      }
    )
  );
  db.close();
});

router.post("/", (req, res) => {
  const db = createDb();
  const {
    catalogItemId,
    name,
    address,
    startDate,
    endDate,
  } = req.body;
  db.serialize(() => {
    const stmt = db.prepare(`
      INSERT INTO bookings (
        catalog_item_id,
        name,
        address,
        start_date,
        end_date
      ) VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(
      catalogItemId,
      name,
      address,
      startDate,
      endDate
    );
    stmt.finalize();
    res.json({
      catalogItemId,
      name,
      address,
      startDate,
      endDate,
    });
  });
  db.close();
});

router.delete("/:id", verifyToken, (req, res) => {
  const db = createDb();
  const { id } = req.params;
  db.serialize(() => {
    const stmt = db.prepare(
      "DELETE FROM bookings WHERE id = (?)"
    );
    stmt.run(id);
    stmt.finalize();
    res.json({ status: "success" });
  });
  db.close();
});

module.exports = router;
