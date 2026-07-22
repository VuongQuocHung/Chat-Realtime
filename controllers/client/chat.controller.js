module.exports.index = (req, res) => {
  _io.on('connection', (socket) => {
    console.log('Có một user kết nối!', socket.id);

    socket.on('disconnect', () => {
      console.log('Có một user đã ngắt kết nối!', socket.id);
    });

  });
  res.render("client/pages/chat/index", {
    pageTitle: "Chat realtime"
  });
};
