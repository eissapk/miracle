<template>
  <p>this is page number {{page}}</p>
</template>

<script>
export default {
  data() {
    return {
      page: null,
    };
  },
  beforeCreate(){
    fetch("/book.json")
    .then(res=> res.json())
    .then(book => {
      console.log(book);
    }).catch(console.error)
  },
  mounted() {
    const page = +this.$route.params.page;
    this.page = page;
    console.log({ page });
  },
};
</script>
