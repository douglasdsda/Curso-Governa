<template>
    <ul class="breadcrumb">
        <li  @click="voltar">
            <a>
                <q-icon name="fa-calendar-check-o" style="font-size: 20px" />
            </a>
        </li>
        <li>
            <a>
                <q-icon :name=iconName style="font-size: 20px" />
            </a>
        </li>
    </ul>
</template>

<script>
export default {
  props: {
    path: {
      type: String,
      default: ''
    }
  }
}
</script>
