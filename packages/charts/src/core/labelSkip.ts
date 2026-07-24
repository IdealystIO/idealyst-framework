/**
 * Band-scale label skipping utilities.
 *
 * Pure functions that determine which labels to show on a categorical axis
 * so that they don't overlap, while always including the first and last labels.
 */

/**
 * Estimate the pixel width of a label string.
 * Uses ~0.6 x fontSize per character as a rough heuristic.
 */
export function estimateLabelWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.6;
}

/**
 * Auto-skip band scale labels so they don't overlap.
 *
 * Returns every Nth value where N is the smallest integer that keeps labels
 * from overlapping, always including the first and last values. When
 * force-including the final label would cause a collision with the preceding
 * stepped label, the preceding label is replaced instead of appending.
 */
export function autoSkipBandLabels(
  domain: (number | string | Date)[],
  axisLength: number,
  fontSize: number,
  formatter: (value: number | string | Date) => string,
  minSpacing: number = 8,
): (number | string | Date)[] {
  if (domain.length <= 1) return domain;

  // Estimate average label width
  const avgWidth =
    domain.reduce((sum: number, v) => sum + estimateLabelWidth(formatter(v), fontSize), 0) /
    domain.length;

  // How many labels fit without overlapping?
  const maxLabels = Math.max(1, Math.floor(axisLength / (avgWidth + minSpacing)));

  if (maxLabels >= domain.length) return domain;

  // Calculate step -- show every Nth label
  const step = Math.ceil(domain.length / maxLabels);

  const result: (number | string | Date)[] = [];
  for (let i = 0; i < domain.length; i += step) {
    result.push(domain[i]);
  }

  // Always include the last label, but check for collision first.
  const lastDomainValue = domain[domain.length - 1];
  if (result[result.length - 1] !== lastDomainValue) {
    // Estimate the position-gap between the last stepped label and the
    // final label. Each domain entry occupies (axisLength / domain.length)
    // pixels, so the gap is the index distance times that band width.
    const lastSteppedIndex = domain.indexOf(result[result.length - 1]);
    const finalIndex = domain.length - 1;
    const bandWidth = axisLength / domain.length;
    const gap = (finalIndex - lastSteppedIndex) * bandWidth;

    // The last stepped label's formatted width is used as the collision
    // threshold (plus the minimum spacing).
    const lastSteppedWidth = estimateLabelWidth(
      formatter(result[result.length - 1]),
      fontSize,
    );

    if (gap < lastSteppedWidth + minSpacing) {
      // Collision: drop the last stepped label in favor of the final one
      result[result.length - 1] = lastDomainValue;
    } else {
      result.push(lastDomainValue);
    }
  }

  return result;
}
