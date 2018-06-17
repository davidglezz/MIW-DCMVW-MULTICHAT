import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapValues'
})
export class MapValuesPipe implements PipeTransform {
  transform<K,V>(map: Map<K,V>, args?: any): IterableIterator<V> {
    return map.values();
  }
}
