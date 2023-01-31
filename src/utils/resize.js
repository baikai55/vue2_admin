function resize(clientHeight) {
  window.onresize = (neww, old) => {
    this.tableHeight = clientHeight;
    this.itemHeaderHeight =
      this.$refs["table"].$el.getBoundingClientRect().top + 66;
    this.itemHeight = neww;
    //表格动态高度
  };
}
export default resize;
