<template>
    <div>
        <h1>My Menu</h1>
        <p>{{id}}</p>
    </div>
</template>

<script>
  export default {
    asyncData ({ params }) {
      return {
        id: params.id
      }
    },
    validate ({ params }) {
      return /^\d+$/.test(params.id)
    }
  }
</script>